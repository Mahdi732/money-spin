import express from "express";
import ContributionController from "../Controllers/ContributionController.js";
import { authenticateJWT } from "../Middleware/auth.Middleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/:groupId/rounds", ContributionController.createRound);
router.post("/rounds/:roundId/pay", ContributionController.payContribution);
router.get("/:groupId/history", ContributionController.getGroupHistory);
router.post("/rounds/:roundId/distribute", ContributionController.distributeFunds);

export default router;
