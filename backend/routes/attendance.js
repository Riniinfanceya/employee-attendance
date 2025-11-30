import express from "express";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
}

router.post("/checkin", auth, async (req, res) => {
  const date = new Date().toLocaleDateString();
  const checkInTime = new Date().toLocaleTimeString();

  await Attendance.create({ userId: req.user.id, date, checkInTime, status: "present" });
  res.json({ msg: "Checked in" });
});

router.post("/checkout", auth, async (req, res) => {
  const date = new Date().toLocaleDateString();
  const checkOutTime = new Date().toLocaleTimeString();

  const rec = await Attendance.findOne({ userId: req.user.id, date });
  rec.checkOutTime = checkOutTime;
  rec.totalHours = 8;
  await rec.save();

  res.json({ msg: "Checked out" });
});

router.get("/my-history", auth, async (req, res) => {
  const data = await Attendance.find({ userId: req.user.id });
  res.json(data);
});

router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "manager") return res.sendStatus(403);
  const all = await Attendance.find().populate("userId", "name employeeId");
  res.json(all);
});

export default router;
