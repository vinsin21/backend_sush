const crypto = require("crypto");
const Prescription = require("../../models/prescription.model");
const Booking = require("../../models/bookings.model");
const { ApiError } = require("../../utils/ApiError");
const { fieldValidator } = require("../../helper/fieldvalidator.helper");
const { ApiResponse } = require("../../utils/ApiResponse");

const makePrescription = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    const bookingId = req.params.bookingId;

    let bookingInfo = await Booking.aggregate([
      {
        $match: {
          bookingId: bookingId,
        },
      },
      {
        $lookup: {
          from: "User",
          localField: custRef,
          foreignField: _id,
          as: userInfo,
        },
      },
    ]);

    bookingInfo = bookingId[0];

    if (!bookingInfo)
      throw new ApiError(404, "booking with bookingId not found in the system");

    const validFields = [""];
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
        } fields are invalid`
      );

    const prescriptionId = crypto.randomUUID();

    let newPrescription = await Prescription.create({
      prescriptionId,
      docRef: req.user?._id,
      docId: req.user.userId,
      custRef: bookingInfo.custRef,
      custId: bookingInfo?.userInfo?.custId, // this must be found and changed
      prescription: requestedFields.prescription,
      ofBookingId: bookingInfo.bookingId,
    });

    if (!newPrescription)
      throw new ApiError(
        500,
        "new prescription for customer with provided bookingId cannot be createed"
      );

    const mailOptions = {
      from: process.env.EMAIL || "",
      to: bookingInfo.email,
      subject: "Prescription From Doctor Has Been Uploaded",
      text: `Name: ${bookingInfo.userInfo.name}\nEmail: ${bookingInfo.userInfo.email}\nMessage: Your prescription has been uploaded by the doctor and you can check it on your dashboard. `,
    };

    await transporter.sendMail(mailOptions);

    // newPrescription?._id="";
    // newPrescription?.docRef="";
    // newPrescription?.custRef="";

    return res
      .status(201)
      .send(
        new ApiResponse(
          201,
          newPrescription,
          "prescription created successfully"
        )
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

const getAllPrescriptions = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    const allPrescriptions = await Prescription.find({ docRef: req.user?._id });

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          allPrescriptions,
          "all prescriptions fetched successfully"
        )
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

const getCustomerPrescriptions = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    if (!req.params.custId) throw new ApiError(400, "no customer id selected");

    const allPrescriptions = await Prescription.find({
      docRef: req.user?._id,
      custId: req.params.custId,
    });

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          allPrescriptions,
          "all prescriptions fetched successfully"
        )
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

const getSinglePrescription = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    if (!req.params.prescriptionId)
      throw new ApiError(400, "no prescription sent in req params");

    const prescription = await Prescription.findOne({
      prescriptionId: req.params.prescriptionId,
    });

    if (!prescription)
      throw new ApiError(
        404,
        "prescription with sent id not found in the system"
      );

    return res
      .status(200)
      .send(
        new ApiResponse(200, prescription, "prescription fetched successfully")
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

const updateSinglePrescription = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    if (!req.params.prescriptionId)
      throw new ApiError(400, "no prescription sent in req params");

    const validFields = [""];

    const requestedFields = req.body;

    const { invalidFields } = fieldValidator(validFields, requestedFields);

    if (invalidFields.length)
      throw new ApiError(
        400,
        `${
          invalidFields.length ? invalidFields : invalidFields.length
        } fields are invalid`
      );

    const prescription = await Prescription.findOneAndUpdate(
      {
        prescriptionId: req.params.prescriptionId,
      },
      {
        $set: {
          prescription: requestedFields.prescription,
        },
      },
      { new: true }
    ).select("-_id -docRef -custRef");

    if (!prescription)
      throw new ApiError(404, "prescription not found to be updated");

    return res
      .status(200)
      .send(
        new ApiResponse(200, prescription, "prescription updated successfully")
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

// it's not a good practice to delete the existing data so we'll not enable the feature to delete prescription rather we'll give them a feature to update the data they're authorised with
const deleteSinglePrescription = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    if (!req.params.prescriptionId)
      throw new ApiError(400, "no prescription sent in req params");

    const deletedPresc = await Prescription.deleteOne({ prescriptionId });

    if (!deletedPresc)
      throw new ApiError(404, "prescription with id not found to be deleted");

    return res
      .status(200)
      .send(
        new ApiResponse(
          204,
          { deleted_prescription_id: deletedPresc.prescriptionId },
          "prescription deleted successfully"
        )
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
  makePrescription,
  getAllPrescriptions,
  getCustomerPrescriptions,
  getSinglePrescription,
  updateSinglePrescription,
};
