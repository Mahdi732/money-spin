import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
	{
		user: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true 
        },
		firstName: { 
            type: String,
            required: true, trim: true 
        },
		lastName: { 
            type: String,
            required: true, trim: true 
        },
		nationalId: { 
            type: String,
            required: true, unique: true 
        },
		idCardImage: { 
            type: String,
            required: true 
        },
		selfieImage: { 
            type: String
        
        },
		isVerByAI: { 
            type: Boolean,
            default: false 
        },
		isVerByAdmin: { 
            type: Boolean,
            default: false 
        },
	},
	{ timestamps: true }
);

kycSchema.index({ user: 1 }, { unique: true });

const KYC = mongoose.model('KYC', kycSchema);

export default KYC;
