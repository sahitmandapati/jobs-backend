const mongoose = require("mongoose");

const ApplicationsJobsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide userId"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    jobId: {
      type: mongoose.Types.ObjectId,
      ref:"Job",
      required: [true, "Please provide position jobId"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applications", ApplicationsJobsSchema);
