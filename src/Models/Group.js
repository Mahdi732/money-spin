import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amountPerRound: {
    type: Number,
    required: true
  },
  roundDurationDays: {
    type: Number,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  status: {
    type: String,
    enum: ["pending", "active", "closed"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
