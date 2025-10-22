import KycService from "../Services/KycService.js";

class KycController {

  static handleError(res, error) {
    const statusCode = error.statusCode || 500;
    const response = { message: error.statusCode ? error.message : 'Server error' };

    if (!error.statusCode) {
      response.error = error.message;
    }

    if (error.details) {
      response.details = error.details;
    }

    return res.status(statusCode).json(response);
  }

  static async submitKYC(req, res) {
    try {
      const kyc = await KycService.submitKYC(req.user.id, req.body);
      res.status(201).json({ message: 'KYC submitted successfully', kyc });
    } catch (error) {
      KycController.handleError(res, error);
    }
  }

  static async getMyKYC(req, res) {
    try {
      const kyc = await KycService.getMyKYC(req.user.id);
      res.status(200).json({ kyc });
    } catch (error) {
      KycController.handleError(res, error);
    }
  }

  static async verifyKYCByAI(req, res) {
    try {
      const kyc = await KycService.verifyKYCByAI(req.params.id, req.body);
      res.status(200).json({ message: 'KYC AI verification updated', kyc });
    } catch (error) {
      KycController.handleError(res, error);
    }
  }

  static async getKycById(req, res) {
    try {
      const kyc = await KycService.getKycById(req.params.id);
      res.status(200).json({ kyc });
    } catch (error) {
      KycController.handleError(res, error);
    }
  }
}

export default KycController;
