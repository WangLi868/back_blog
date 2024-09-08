import { Router } from "express";
import checkAuthMiddleware from "../middlewares/authMiddleware.mjs";
import prisma from "../utils/db.mjs";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.get(
  "/api/users",
  checkAuthMiddleware(["admin"]),
  async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true },
    });
    res.status(200).json(users);
  }
);

userRouter.get(
  "/api/users/:id",
  checkAuthMiddleware(["admin", "author"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const foundUser = await prisma.user.findUnique({
        where: { id: +id },
        select: { id: true, username: true, email: true },
      });

      if (foundUser) {
        return res.json(foundUser);
      }
      return res.status(404).json({ message: "user not found!" });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
);

userRouter.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    if (newUser)
      return res.status(201).json({ message: "user created successfully!" });
    throw new Error("Cloud not create new user.");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


userRouter.delete(
  "/api/users/:id",
  checkAuthMiddleware(["admin", "author"]),
  (req, res) => {
    const { id } = req.params;
    const deleteUser = users.filter((u) => u.id !== id);
    if (deleteUser) res.status(404).json({ message: "user not found" });
  }
);

userRouter.put(
  "/api/users/:id",
  checkAuthMiddleware(["admin", "author"]),
  (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const foundUser = users.find((u) => u.id === +id);

    if (username) foundUser.username = username;
    if (email) foundUser.email = email;
    if (password) foundUser.password = password;
    res.json({ message: "user modified" });
  }
);

export default userRouter;
