const mongoose = require("mongoose");

const timeslotsSchema = new mongoose.Schema(
  {
    docRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    docId: {
      type: String,
      required: true,
      trim: true,
    },
    sessionTimeInterval: {
      type: Number,
      required: true,
      max: 120,
      min: 30,
    },
    availableDay: {
      type: String,
      required: true,
      enum: [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THRUSDAY",
        "FRIDAY",
        "SATURDAY",
      ],
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    availableTo: {
      type: Date,
      required: true,
    },
    timeslots: {
      startFrom: {
        type: Date,
        required: true,
      },
      endAt: {
        type: Date,
        required: true,
      },
      bookedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeSlots", timeslotsSchema);
