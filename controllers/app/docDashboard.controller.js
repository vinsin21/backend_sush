const Bookings = require("../../models/bookings.model");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");

const getAllBookings = async (req, res) => {
  try {
    if (!req.user?._id) throw new ApiError(401, "invalid user credentials");

    if (!req.role == "DOCTOR")
      throw new ApiError(403, "forbidden access to this resource");

    const allBookings = await Bookings.find({ docRef: req.user?._id });

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          allBookings,
          "all bookings of the doc fetched successfully"
        )
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error.statusCode || 500)
      .send(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

const getSingleBooking = async (req, res) => {
  try {
    if (!req.user?._id) throw new ApiError(401, "invalid user credentials");

    if (!req.role == "DOCTOR")
      throw new ApiError(403, "forbidden access to this resource");

    const { bookingId } = req.params;

    if (!bookingId) throw new ApiError(400, "no booking id selected");

    const booking = await Bookings.find({
      docRef: req.user?._id,
      bookingId,
    });

    if (!booking)
      throw new ApiError(
        404,
        "booking with bookingId and current user not found"
      );

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          booking,
          "all bookings of the doc fetched successfully"
        )
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error.statusCode || 500)
      .send(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

const cancelSingleBooking = async (req, res) => {
  try {
    if (!req.user?._id) throw new ApiError(401, "invalid user credentials");

    if (!req.role == "DOCTOR")
      throw new ApiError(403, "forbidden access to this resource");

    const { bookingId } = req.params;

    if (!bookingId) throw new ApiError(400, "no booking id selected");

    const cancelledBooking = await Bookings.findOneAndUpdate(
      {
        docRef: req.user?._id,
        bookingId,
      },
      {
        $set: {
          isCancelled: true,
        },
      },
      { new: true }
    );

    if (!booking.isCancelled)
      throw new ApiError(
        404,
        "booking with bookingId and current user not found to cancel"
      );

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          { bookingId, isCancelled: cancelledBooking.isCancelled },
          "all bookings of the doc fetched successfully"
        )
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error.statusCode || 500)
      .send(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

module.exports = {
  getAllBookings,
  getSingleBooking,
  cancelSingleBooking,
};
