import { Router } from "express";
import jwt from "jsonwebtoken";
import { io } from "../../app.js";
import { getUserByAccessToken } from "./../../middleware/index.js";
import { Users } from "./model.js";

const userRouter = Router();

userRouter.post("/auth", (req, res) => {
  const data = req.body;
  const { email, name } = data;
  if (!email || !name) return res.status(400).send("Invalid data");

  try {
    Users.findOne({ email }).then((user) => {
      if (user) {
        const accessToken = jwt.sign(
          user.toObject(),
          process.env.ACCESS_TOKEN_SECRET
        );
        return res.send({
          accessToken,
          user,
        });
      } else {
        const newUser = new Users({
          email,
          name,
          imageId: "",
        });
        newUser.save().then((user) => {
          const accessToken = jwt.sign(
            user.toObject(),
            process.env.ACCESS_TOKEN_SECRET
          );
          return res.send({
            accessToken,
            user,
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

userRouter.get("/getUser", getUserByAccessToken, async (req, res) => {
  res.send(req.user);
});

userRouter.get("/getAllUsers", getUserByAccessToken, async (req, res) => {
  const users = await Users.find().select("name imageId _id");
  res.send(users);
});

userRouter.get(
  "/getAllConversations",
  getUserByAccessToken,
  async (req, res) => {
    const user = req.user;
    const groupConversations = await Users.findById(req.user._id).populate({
      path: "Groups",
      populate: {
        path: "members lastMessage",
        select: "name ImageId message createdAt",
        match: { _id: { $ne: user._id } },
      },
      select: `-messages`,
    });

    io.emit(`conversations-${user._id}`, groupConversations);
    res.send(groupConversations);
  }
);

export default userRouter;
