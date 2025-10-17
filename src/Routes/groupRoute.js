import express from "express";
import GroupController from "../Controllers/GroupController.js";
import { authenticateJWT } from "../Middleware/auth.Middleware.js";
import { requireVerification } from "../Middleware/group.Middleware.js";

const router = express.Router();

router.use(authenticateJWT, requireVerification);

router.post("/", GroupController.createGroup);
router.get("/", GroupController.getMyGroups);
router.post("/:id/join", GroupController.joinGroup);
router.put("/:id", GroupController.updateGroup);
router.delete("/:id", GroupController.deleteGroup);

export default router;
