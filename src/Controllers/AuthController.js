import AuthService from '../Services/AuthService.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signup(req, res) {
    try {
      const result = await this.authService.signup(req.body);
      res.status(201).json({ message: 'you create account with success', user: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await this.authService.login(req.body);
      res.json({ message: 'you login with success', ...result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
