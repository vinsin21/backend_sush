const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    docRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    custRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    prescription: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
      min: 30,
    },
    ofBookingId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
