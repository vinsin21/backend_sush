const { default: mongoose } = require("mongoose");
const DocDetails = require("../../models/docDetails.model");
const User = require("../../models/user.model");

const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");

// all docs
// single doctor
// get all prescription
// get single doc's pres
// get all booking
// get single booking
// profile update

const getAllActiveDoctors = async (req, res) => {
  try {
    const allDoctors = await User.find({
      role: "DOCTOR",
      isActive: true,
      isVerified: true,
      isDisabledByAdmin: false,
    });

let resultsArr = []

    for (let i = 0; i < allDoctors.length; i++) {
      console.log(allDoctors[i]?._id);
      const result = await DocDetails.findOne({ userRef: allDoctors[i]._id });


      resultsArr.push({metaData:allDoctors[i],info:result})

      allDoctors[i].result = result;
      allDoctors[i]._id = null;
      allDoctors[i].password = null;
    }

console.log(resultsArr);

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          resultsArr,
          "all active and verified doctors fetched successfully"
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

const getSingleDoctor = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId ) throw new ApiError(400, "no user/doc id selected")

    const doctor = await User.findOne({ userId, role: "DOCTOR" })

    if (!doctor) throw new ApiError(404, "no user/doc found with selected userId")

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          allDoctors,
          "all active and verified doctors fetched successfully"
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

module.exports = { getAllActiveDoctors,getSingleDoctor};
