import mongoose from "mongoose";

const contributionRoundSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true 
},
  roundNumber: { 
    type: Number, 
    required: true 
}, 
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
}, 
  totalAmount: { 
    type: Number, 
    default: 0 
  },
  contributions: [
    {
      member: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
      amount: Number,
      paid: { 
        type: Boolean, 
        default: false 
      },
      paidAt: Date
    }
  ],
  isDistributed: { 
    type: Boolean, 
    default: false 
},
  distributedAt: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
}
});

export default mongoose.model("ContributionRound", contributionRoundSchema);
