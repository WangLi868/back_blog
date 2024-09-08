import prisma from "./db.mjs";
import bcrypt from "bcrypt";

const admin = {
  username: "admin",
  email: "admin@gmail.com",
  //
};

const profileAdmin = {
  role: "ADMIN",
};

async function seedAdmin() {
  const newAdminRecord = await prisma.user.create({
    data: {
      ...admin,
      password: await hashPassword("123456"),
      profile: {
        create: { ...profileAdmin },
      },
    },
  });
  console.log("admin created successfully");
}
seedAdmin();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
