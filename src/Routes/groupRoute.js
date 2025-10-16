import express from "express";
import {
  createGroup,
  getMyGroups,
  joinGroup,
  updateGroup,
  deleteGroup,
} from "../Controllers/GroupController.js";
import { authenticateJWT } from "../Middleware/auth.Middleware.js";
import { requireVerification } from "../Middleware/group.Middleware.js";

const router = express.Router();

router.use(authenticateJWT, requireVerification);

router.post("/", createGroup);
router.get("/", getMyGroups);
router.post("/:id/join", joinGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
