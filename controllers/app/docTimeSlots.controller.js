const { fieldValidator } = require("../../helper/fieldvalidator.helper");
const TimeSlots = require("../../models/timeslots.model");
const crypto = require("crypto");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");

const createDocTimeSlots = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR") {
      throw new ApiError(401, "Invalid user credentials");
    }

    const validFields = [
      "sessionTimeInterval",
      "availableDay",
      "availableFromTime",
      "availableToTime",
      "timeslots",
    ];
    const requestedFields = req.body;

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

    if (
      !requestedFields.timeslots.startFrom ||
      !requestedFields.timeslots.endAt
    )
      throw new ApiError(400, "invalid time slots start or end time");

    const timeslotsExists = await TimeSlots.findOne({
      docRef: req.user?._id,
      availableDay: requestedFields.availableDay,
      "timeslots.startFrom": requestedFields.timeslots.startFrom,
      "timeslots.endAt": requestedFields.timeslots.endAt,
    });

    if (timeslotsExists) throw new ApiError(409, "time slot already exists");

    const timeslotId = crypto.randomUUID();

    const timeslots = await TimeSlots.create({
      docRef: req.user?._id,
      timeslotId,
      ...requestedFields,
    });

    if (!timeslots)
      throw new ApiError(500, "unable to create timeslots with current user");

    return res
      .status(201)
      .send(
        new ApiResponse(201, timeslots, "time slots generated successfully")
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
      .status(201)
      .send(
        new ApiResponse(201, timeslots, "time slots generated successfully")
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

    const timeslotId = req.params;
    if (!timeslotId) throw new ApiError(400, "no time slot selected");

    const validFields = [
      "sessionTimeInterval",
      "sessionCountOfDay",
      "availableFromTime",
      "availableToTime",
      "timeslots",
    ];
    const requestedFields = req.body;

    const { invalidFields } = fieldValidator(validFields, requestedFields);

    if (invalidFields.length)
      throw new ApiError(
        400,
        `${
          invalidFields.length ? invalidFields : invalidFields.length
        } fields are invalid`
      );

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
