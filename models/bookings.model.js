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
    onDate: {
      type: Date,
      required: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingsSchema);

// cocosingh456: fRSZAEbtVRndu28Y;
