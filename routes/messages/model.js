import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: String,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Messages = mongoose.model("Messages", messageSchema);
