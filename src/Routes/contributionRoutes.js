import express from "express";
import { authenticateJWT } from "../Middleware/auth.Middleware.js";
import { createRound, payContribution, distributeFunds } from "../Controllers/ContributionController.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/:groupId/rounds", createRound);
router.post("/rounds/:roundId/pay", payContribution);
router.post("/rounds/:roundId/distribute", distributeFunds);

export default router;
