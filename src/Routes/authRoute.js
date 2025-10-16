import express from 'express';
import AuthController from '../Controllers/AuthController.js';

const router = express.Router();
const authController = new AuthController();

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));

export default router;
