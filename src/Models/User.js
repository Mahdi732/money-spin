import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    full_name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6 
    },
    isVerified: {             
      type: Boolean,
      default: false
    },
    role: {                   
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

class UserClass {
  static async register(full_name, email, password) {
    const existing = await this.findOne({ email });
    if (existing) {
      throw new Error('email is already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this({ full_name, email, password: hashedPassword });
    await user.save();
    return user;
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);
export default User;
