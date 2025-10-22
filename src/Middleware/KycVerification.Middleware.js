import KycService from '../Services/KycService.js';

export default async function kycVerification(req, res, next) {
	try {
		await KycService.ensureUserKycVerified(req.user.id);
		next();
	} catch (error) {
		const statusCode = error.statusCode || 500;
		const response = { message: error.statusCode ? error.message : 'Server error' };

		if (!error.statusCode) {
			response.error = error.message;
		}

		res.status(statusCode).json(response);
	}
}
