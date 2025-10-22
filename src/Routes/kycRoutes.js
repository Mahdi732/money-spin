import express from 'express';
import KycController from '../Controllers/KycController.js';
import authMiddleware from '../Middleware/auth.Middleware.js';
import kycVerification from '../Middleware/KycVerification.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', KycController.submitKYC);
router.get('/me', KycController.getMyKYC);
router.get('/:id', kycVerification, KycController.getKycById);

export default router;
