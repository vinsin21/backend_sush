const { fieldValidator } = require("../../helper/fieldvalidator.helper");
const TimeSlots = require("../../models/timeslots.model");
const crypto = require("crypto");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");

function dateTimeParser(datetime) {
  const timeString = datetime; // hr:min:sec   and i can also if the time session interval and input start and end time difference is equal to session time interval entered

  return timeString + ":00";
}

const createDocTimeSlots = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR") {
      throw new ApiError(401, "Invalid user credentials");
    }

    const validFields = [
      "sessionTimeInterval",
      "sessionCountOfDay",
      "availableDay",
      "availableFromTime",
      "availableToTime",
      "startFrom",
      "endAt",
    ];
    let requestedFields = req.body;

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${
          invalidFields.length ? invalidFields : invalidFields.length
        } fields are invalid, ${
          missingFields.length ? missingFields : missingFields.length
        } fields are missing`
      );

    if (!requestedFields.startFrom || !requestedFields.endAt)
      throw new ApiError(400, "invalid time slots for start or end time");

    const timeslotsExists = await TimeSlots.findOne({
      docRef: req.user?._id,
      availableDay: requestedFields.availableDay,
    });

    if (timeslotsExists)
      throw new ApiError(
        409,
        "time slot already exists, creating time slots for same days are not allowed, instead try updating them"
      );

    const timeslotId = crypto.randomUUID();

    if (requestedFields.startFrom.length !== requestedFields.endAt.length)
      throw new ApiError(400, "please provide all start and end time");

    let timeslots = [];

    for (let i = 0; i < requestedFields.startFrom.length; i++) {
      const startFromTime = dateTimeParser(requestedFields.startFrom[i]);
      const endAtTime = dateTimeParser(requestedFields.endAt[i]);

      timeslots.push({
        startFrom: startFromTime,
        endAt: endAtTime,
      });
    }

    requestedFields.startFrom = undefined;
    requestedFields.endAt = undefined;

    requestedFields.availableFromTime = dateTimeParser(
      requestedFields.availableFromTime
    );
    requestedFields.availableToTime = dateTimeParser(
      requestedFields.availableToTime
    );
    requestedFields.timeslots = timeslots;

    const docTimeslots = await TimeSlots.create({
      docRef: req.user?._id,
      timeslotId,
      ...requestedFields,
    });

    if (!docTimeslots)
      throw new ApiError(500, "unable to create timeslots with current user");

    return res
      .status(201)
      .send(
        new ApiResponse(201, docTimeslots, "time slots generated successfully")
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(
        new ApiError(
          error?.statusCode || 500,
          error?.message || "internal server error"
        )
      );
  }
};

const getCurrentTimeSlots = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR") {
      throw new ApiError(401, "Invalid user credentials");
    }

    const timeslots = await TimeSlots.findOne({ docRef: req.user?._id });

    return res
      .status(200)
      .send(
        new ApiResponse(200, timeslots, "time slots generated successfully")
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(
        new ApiError(
          error?.statusCode || 500,
          error?.message || "internal server error"
        )
      );
  }
};

const updateCurrentTimeSlots = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR") {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { timeslotId } = req.query;
    if (!timeslotId) throw new ApiError(400, "no time slot selected");

    const validFields = [
      "sessionTimeInterval",
      "sessionCountOfDay",
      "availableFromTime",
      "availableToTime",
      "startFrom",
      "endAt",
    ];
    const requestedFields = ({
      sessionTimeInterval,
      sessionCountOfDay,
      availableFromTime,
      availableToTime,
      startFrom,
      endAt,
    } = req.body);

    const { invalidFields } = fieldValidator(validFields, requestedFields);

    if (invalidFields.length)
      throw new ApiError(
        400,
        `${
          invalidFields.length ? invalidFields : invalidFields.length
        } fields are invalid`
      );

    if (startFrom.length !== endAt.length)
      throw new ApiError(400, "please provide all start and end times");

    requestedFields.availableFromTime = availableFromTime
      ? dateTimeParser(availableFromTime)
      : undefined;

    requestedFields.availableToTime = availableToTime
      ? dateTimeParser(availableToTime)
      : undefined;

    let timeslots = [];
    if (startFrom.length == endAt.length) {
      for (let i = 0; i < startFrom.length; i++) {
        let startFromTime = dateTimeParser(startFrom[i]);
        let endAtTime = dateTimeParser(endAt[i]);

        timeslots.push({ startFrom: startFromTime, endAt: endAtTime });
      }

      requestedFields.startFrom = undefined;
      requestedFields.endAt = undefined;

      requestedFields.timeslots = timeslots;
    }

    const updatedTimeslots = await TimeSlots.findOneAndUpdate(
      {
        docRef: req.user?._id,
        timeslotId,
      },
      {
        $set: {
          ...requestedFields,
        },
      },
      { new: true }
    ).select("-_id -docRef -__v");

    if (!updatedTimeslots)
      throw new ApiError(
        404,
        "time slot with selected id and current logged in user not found in the system"
      );

    return res
      .status(200)
      .send(
        new ApiResponse(200, updatedTimeslots, "time slot updated successfully")
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(
        new ApiError(
          error?.statusCode || 500,
          error?.message || "internal server error"
        )
      );
  }
};

module.exports = {
  createDocTimeSlots,
  getCurrentTimeSlots,
  updateCurrentTimeSlots,
};
