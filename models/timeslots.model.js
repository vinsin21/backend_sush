const mongoose = require("mongoose");

const timeslotsSchema = new mongoose.Schema(
  {
    docRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    timeslotId: {
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
    sessionCountOfDay: {
      type: Number,
      required: true,
      max: 12,
      min: 1,
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
    availableFromTime: {
      type: String,
      required: true,
    },
    availableToTime: {
      type: String,
      required: true,
    },
    timeslots: [
      {
        startFrom: {
          type: String,
          required: true,
        },
        endAt: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeSlots", timeslotsSchema);
