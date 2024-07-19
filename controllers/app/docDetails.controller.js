const crypto = require("crypto");
const DocDetails = require("../../models/docDetails.model");
const fs = require("fs");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");
const { fieldValidator } = require("../../helper/fieldvalidator.helper");
const {
  relativePathGenerator,
  absolutePathGenerator,
} = require("../../utils/pathGenerators");
const { default: mongoose } = require("mongoose");

const insertDocDetails = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR") {
      throw new ApiError(401, "Invalid user credentials");
    }

    if (await DocDetails.findOne({ userRef: req.user?._id }))
      throw new ApiError(
        409,
        "user's/ doc's details already exists in the system"
      );

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

    if (invalidFields.length || missingFields.length) {
      throw new ApiError(
        400,
        `${
          invalidFields.length
            ? `Invalid fields: ${invalidFields.join(", ")}`
            : ""
        }${invalidFields.length && missingFields.length ? ", " : ""}${
          missingFields.length
            ? `Missing fields: ${missingFields.join(", ")}`
            : ""
        }`
      );
    }

    // Convert req.files to an array if it's an object
    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files);

    if (filesArray.length === 0) {
      throw new ApiError(400, "No files found in request");
    }

    // Generate relative paths for the uploaded files
    const professionalCertificates = relativePathGenerator(filesArray);

    if (professionalCertificates.length !== filesArray.length) {
      throw new ApiError(500, "File upload unsuccessful");
    }

    const detailsAlreadyExists = await DocDetails.findOne({
      userRef: req.user._id,
    });

    if (detailsAlreadyExists) {
      throw new ApiError(
        409,
        "Details with current user already exist in the system"
      );
    }

    requestedFields.professionalCertificates = professionalCertificates;

    const detailsId = crypto.randomUUID(); // Or use uuidv4() if crypto.randomUUID() is not supported
    const newDetails = await DocDetails.create({
      userRef: req.user?._id,
      detailsId,
      ...requestedFields,
    });

    if (!newDetails) {
      throw new ApiError(500, "Doc details addition unsuccessful");
    }

    return res
      .status(201)
      .send(
        new ApiResponse(
          201,
          { newDetails },
          "Doctor credentials inserted in DB successfully"
        )
      );
  } catch (error) {
    console.error("Error occurred:", error.message);

    // Clean up uploaded files
    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files);
    filesArray.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Failed to delete file at ${file.path}:`, err);
      });
    });

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

const getCurrDocDetails = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "DOCTOR")
      throw new ApiError(401, "invalid user credentials");

    const docData = await DocDetails.findOne({
      userRef: new mongoose.Types.ObjectId(`${req.user?._id}`),
    }).select("-_id -createdAt -updatedAt -__v");

    if (!docData)
      throw new ApiError(404, "currently logged user's data not found");

    docData.userRef = undefined;
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

    const docDetailsExists = await DocDetails.findOne({
      userRef: req.user?._id,
    });

    if (!docDetailsExists)
      throw new ApiError(
        404,
        "current user's/doctor's details not found in the system"
      );

    //  MUST BE RESOLVED IN FUTURE
    // if (docDetailsExists.professionalCertificates.length) {
    //   const absolutePath = absolutePathGenerator(
    //     docDetailsExists.professionalCertificates
    //   );

    //   console.log(absolutePath);

    //   for (let i = 0; i < absolutePath.length; i++) {
    //     fs.unlinkSync(absolutePath[i]);
    //   }
    // }

    let professionalCertificates = [];

    if (req.files.length) {
      const filesArray = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files);

      professionalCertificates = relativePathGenerator(filesArray);
    }

    requestedFields.professionalCertificates = professionalCertificates;

    const upDocDtls = await DocDetails.findOneAndUpdate(
      { userRef: req.user?._id },
      {
        ...requestedFields,
      },
      { new: true }
    ).select("-_id -userRef -__v");

    if (!upDocDtls)
      throw new ApiError(500, "unable to update doctor's doc & details");

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
