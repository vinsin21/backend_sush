const crypto = require("crypto");
const DocDetails = require("../../models/docDetails.model");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");
const { fieldValidator } = require("../../helper/fieldvalidator.helper");

const insertDocDetails = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    const validFields = [
      "experience",
      "primaryCare",
      "surgicalSpecialties",
      "internalMedicineSubspecialties",
      "diagnosticSpecialties",
      "preventiveMedicine",
      "emergencyMedicine",
      "specialtyAndSubspecialtyFields",
      "nonClinicalSpecialties",
      "complementaryAndAlternativeMedicine",
      "specializedAreas",
    ];

    const requestedFields = req.body;

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} are invalid, ${
          missingFields.length ? missingFields : ""
        } are missing`
      );

    if (!req.files.length) throw new ApiError(400, "no files found in request");

    const pathArr = [];

    req.files.forEach((file) => {
      const relativePath = relativePathGenerator(file.path);
      console.log("fp", file.path);
      console.log("rp", relativePath);
      pathArr.push(relativePath);
    });

    const detailsAlreadyExists = await DocDetails.findOne({
      userRef: req.user?._id,
    });

    if (detailsAlreadyExists)
      throw new ApiError(
        409,
        "details with current user already exists in the system"
      );

    requestedFields.professionalCertificates = pathArr;

    const detailsId = crypto.randomUUID();
    const newDetails = await DocDetails.create({
      detailsId,
      ...requestedFields,
    });

    if (!newDetails)
      throw new ApiError(500, "doc details addition unsuccessful");

    return res
      .status(201)
      .send(
        new ApiResponse(
          201,
          { newDetails },
          "doctor credentials inserted in db successfully"
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

const getCurrDocDetails = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    const docData = await DocDetails.findById(req.user?._id).select(
      "-_id -createdAt -updatedAt -__v"
    );

    if (!docData)
      throw new ApiError(404, "currently logged user's data not found");

    docData.name = req.user?.name;
    docData.email = req.user?.email;
    docData.userId = req.user?.userId;

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          docData,
          "current user's data fetched successfully"
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

const updateDocDetails = async (req, res) => {
  try {
    // we need to unlink the existing files too in this and that's pending
    // after that only we'll update the current user with docs

    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    const validFields = [
      "experience",
      "primaryCare",
      "surgicalSpecialties",
      "internalMedicineSubspecialties",
      "diagnosticSpecialties",
      "preventiveMedicine",
      "emergencyMedicine",
      "specialtyAndSubspecialtyFields",
      "nonClinicalSpecialties",
      "complementaryAndAlternativeMedicine",
      "specializedAreas",
    ];

    const requestedFields = req.body;

    const { invalidFields } = fieldValidator(validFields, requestedFields);

    if (invalidFields.length)
      throw new ApiError(400, `${invalidFields} are invalid`);

    const pathArr = [];
    if (req.files) {
      req.files.forEach((file) => {
        const relativePath = relativePathGenerator(file.path);
        pathArr.push(relativePath);
      });
    }

    requestedFields.professionalCertificates = pathArr;

    const upDocDtls = await DocDetails.findOneAndUpdate(
      { userRef: req.user?._id },
      {
        ...requestedFields,
      },
      { new: true }
    ).select("-_id -userRef -__v");

    if (!upDocDtls)
      throw new ApiError(
        404,
        "current user's doc not found to be updated, try uploading your details first"
      );

    return res
      .status(200)
      .send(new ApiResponse(200, upDocDtls, "documents updated successfully"));
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

module.exports = { insertDocDetails, getCurrDocDetails, updateDocDetails };
