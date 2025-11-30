import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  checkInTime: String,
  checkOutTime: String,
  status: String,
  totalHours: Number
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
