import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@test.com" });
  if (existing) {
    console.log("Default user already exists.");
    process.exit();
  }

  const hash = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin User",
    email: "admin@test.com",
    password: hash,
    role: "employee"
  });

  console.log("Default user created:");
  console.log("Email: admin@test.com");
  console.log("Password: 123456");

  process.exit();
}

createUser();
