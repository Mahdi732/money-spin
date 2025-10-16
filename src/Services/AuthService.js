import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class AuthService {
  async signup({ full_name, email, password }) {
    const user = await User.register(full_name, email, password);
    return {
      id: user._id,
      full_name: user.full_name,
      email: user.email
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('the email is no existed try to use other one');

    const match = await user.comparePassword(password);
    if (!match) throw new Error('password is incorrect try another time');

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return { user: { id: user._id, email: user.email }, token };
  }
}
