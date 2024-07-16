const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      trim: true,
    },
    customerRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    docRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    fromTime: {
      type: Date,
      required: true,
    },
    toTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingsSchema);

// cocosingh456: fRSZAEbtVRndu28Y;
