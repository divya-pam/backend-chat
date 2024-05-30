import { Router } from "express";
import { io } from "../../index.js";
import { getUserByAccessToken } from "../../middleware/index.js";
import { Groups } from "../groups/model.js";
import { Messages } from "../messages/model.js";

const router = Router();

router.post("/send", getUserByAccessToken, async (req, res) => {
  const user = req.user;
  const { message, groupId } = req.body;

  const group = await Groups.findById(groupId);

  const newMsg = await Messages.create({
    message,
    sender: user._id,
  });

  group.messages.push(newMsg._id);
  group.lastMessage = newMsg._id;
  await group.save();

  const updatedGroup = await Groups.findById(groupId).populate({
    path: "members messages lastMessage",
    select: "name imageId message createdAt sender",
    match: { _id: { $ne: user._id } },
  });

  io.emit(`conversation-${updatedGroup._id}`, updatedGroup);

  res.send(updatedGroup);
});

export default router;
