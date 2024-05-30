import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: String,
  imageId: String,
  isGroup: Boolean,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
  lastMessage: [
    {
          type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
    },
  ],
});

export const Groups = mongoose.model("Groups", groupSchema);
