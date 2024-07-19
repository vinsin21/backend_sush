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

    for (let i = 0; i < allDoctors.length; i++) {
      const result = await DocDetails.findOne({ userRef: allDoctors[i]._id });

      allDoctors[i].details = result;
      allDoctors[i]._id = null;
      allDoctors[i].password = null;
    }

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

module.exports = { getAllActiveDoctors };
