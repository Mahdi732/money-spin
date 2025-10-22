import path from "path";
import crypto from "crypto";
import * as faceapi from "face-api.js";
import KYC from "../Models/KycModel.js";

let faceModelsLoaded = false;

export default class KycService {
  static getCanvasModules() {
    try {
      const canvas = require("canvas");
      const { Canvas, Image, ImageData } = canvas;
      faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
      return canvas;
    } catch (error) {
      const err = new Error('Canvas dependency missing. Install the "canvas" package');
      err.statusCode = 500;
      throw err;
    }
  }

  static async loadFaceModels() {
    if (faceModelsLoaded) return;

    const modelsPath = process.env.FACE_API_MODEL_PATH || path.join(process.cwd(), "models");

    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
        faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
        faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
      ]);
      faceModelsLoaded = true;
    } catch (error) {
      const err = new Error("Cannot load face recognition models");
      err.statusCode = 500;
      throw err;
    }
  }

  static async loadImageFromSource(canvas, source) {
    if (!source) {
      const error = new Error("Image source missing");
      error.statusCode = 400;
      throw error;
    }

    if (/^data:/.test(source)) {
      const base64 = source.split(",")[1];
      const buffer = Buffer.from(base64, "base64");
      return canvas.loadImage(buffer);
    }

    if (/^https?:/.test(source)) {
      const response = await fetch(source);
      if (!response.ok) {
        const error = new Error("Unable to download image from URL");
        error.statusCode = 400;
        throw error;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      return canvas.loadImage(buffer);
    }

    return canvas.loadImage(source);
  }

  static async compareFaces({ idCardImage, selfieImage }) {
    const canvas = this.getCanvasModules();
    await this.loadFaceModels();

    const [idImage, selfie] = await Promise.all([
      this.loadImageFromSource(canvas, idCardImage),
      this.loadImageFromSource(canvas, selfieImage),
    ]);

    const [idResult, selfieResult] = await Promise.all([
      faceapi.detectSingleFace(idImage).withFaceLandmarks().withFaceDescriptor(),
      faceapi.detectSingleFace(selfie).withFaceLandmarks().withFaceDescriptor(),
    ]);

    if (!idResult || !selfieResult) {
      const error = new Error("Unable to detect faces in provided images");
      error.statusCode = 400;
      throw error;
    }

    const distance = faceapi.euclideanDistance(idResult.descriptor, selfieResult.descriptor);
    const threshold = Number(process.env.FACE_MATCH_THRESHOLD ?? "") || 0.45;
    const matches = Number.isFinite(distance) && distance < threshold;

    return { matches, distance, threshold };
  }

  static hashImageData(value) {
    const hash = crypto.createHash("sha256");

    if (!value) return "";

    if (/^data:/.test(value)) {
      const base64 = value.split(",")[1] || "";
      const buffer = Buffer.from(base64, "base64");
      hash.update(buffer);
    } else {
      hash.update(value);
    }

    return hash.digest("hex");
  }

  static sanitizeKyc(record) {
    if (!record) return null;
    return typeof record.toObject === "function" ? record.toObject() : { ...record };
  }

  static async submitKYC(userId, payload = {}) {
    const requiredFields = ["firstName", "lastName", "nationalId", "idCardImage", "selfieImage"];
    const missing = requiredFields.filter((f) => !payload[f]);
    if (missing.length) {
      const error = new Error(`Missing required fields: ${missing.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    const comparison = await this.compareFaces({
      idCardImage: payload.idCardImage,
      selfieImage: payload.selfieImage,
    });

    if (!comparison.matches) {
      const error = new Error("Face verification failed. Please upload clear matching photos.");
      error.statusCode = 400;
      error.details = { distance: comparison.distance, threshold: comparison.threshold };
      throw error;
    }

    const kyc = await KYC.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        nationalId: payload.nationalId,
        idCardImage: this.hashImageData(payload.idCardImage),
        selfieImage: this.hashImageData(payload.selfieImage),
        isVerByAI: true,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return this.sanitizeKyc(kyc);
  }

  static async getMyKYC(userId) {
    const kyc = await KYC.findOne({ user: userId });
    if (!kyc) {
      const error = new Error("KYC record not found");
      error.statusCode = 404;
      throw error;
    }
    return this.sanitizeKyc(kyc);
  }

  static async verifyKYCByAI(kycId, payload = {}) {
    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      const error = new Error("KYC record not found");
      error.statusCode = 404;
      throw error;
    }

    if (!payload.idCardImage || !payload.selfieImage) {
      const error = new Error("Both ID card and selfie images are required for verification");
      error.statusCode = 400;
      throw error;
    }

    const comparison = await this.compareFaces({
      idCardImage: payload.idCardImage,
      selfieImage: payload.selfieImage,
    });

    kyc.isVerByAI = comparison.matches;
    if (comparison.matches) {
      kyc.idCardImage = this.hashImageData(payload.idCardImage);
      kyc.selfieImage = this.hashImageData(payload.selfieImage);
      await kyc.save();
    } else {
      kyc.isVerByAI = false;
      await kyc.save();

      const error = new Error("Face verification failed. Please upload clear matching photos.");
      error.statusCode = 400;
      error.details = { distance: comparison.distance, threshold: comparison.threshold };
      throw error;
    }

    return this.sanitizeKyc(kyc);
  }

  static async getKycById(kycId) {
    const kyc = await KYC.findById(kycId).populate("user", "full_name email role");
    if (!kyc) {
      const error = new Error("KYC record not found");
      error.statusCode = 404;
      throw error;
    }
    return this.sanitizeKyc(kyc);
  }

  static async ensureUserKycVerified(userId) {
    const kyc = await KYC.findOne({ user: userId });
    if (!kyc || (!kyc.isVerByAI && !kyc.isVerByAdmin)) {
      const error = new Error("KYC verification required");
      error.statusCode = 403;
      throw error;
    }
    return this.sanitizeKyc(kyc);
  }
}
