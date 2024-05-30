import { Router } from "express";
import { getUserByAccessToken } from "../../middleware/index.js";
import { Messages } from "../messages/model.js";
import { Users } from "../user/model.js";
import { Groups } from "./model.js";

const groupRouter = Router();

groupRouter.post("/create", getUserByAccessToken, async (req, res) => {
  const user = req.user;
  const { members, message, isGroup } = req.body;
  if (!members || members.length <= 0 || !message) {
    return res.status(400).send("Invalid data");
  }

  try {
    const newMembers = [...members, user.id];
    // if (members.length == 2) {
    //   await Users.findById(
    //     members.forEach((member) => {
    //       if (member !== req.user) {
    //         return;
    //       }
    //     })
    //   );
    // }

    const group = await Groups.create({ members: newMembers, isGroup });
    const newMessage = await Messages.create({
      sender: user._id,
      message,
    });

    group.messages.push(newMessage._id);
    group.lastMessage = newMessage._id;

    group.members.forEach(async (member) => {
      const user = await Users.findById(member);
      user.Groups.push(group._id);
      await user.save();
    });

    await group.save();

    res.send({ success: true, _id: group._id });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
});

groupRouter.get("/getById", getUserByAccessToken, async (req, res) => {
  const user = req.user;
  const { conversationId } = req.query;

  const conversation = await Groups.findById(conversationId).populate({
    path: "members messages lastMessage",
    select: "name imageId message createdAt sender",
    match: { _id: { $ne: user._id } },
  });

  res.send(conversation);
});

export default groupRouter;
