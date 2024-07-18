const DocDetails = require("../../models/docDetails.model");
const Timeslots = require("../../models/timeslots.model");
const User = require("../../models/user.model");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");

// add, disable, delete doctor

const doctorRegister = async (req, res) => {
  try {
    if (!req.user?._id) throw new ApiError(401, "invalid admin creds");

    if (!req.role !== "ADMIN")
      throw new ApiError(
        403,
        "you are forbidden to access admin routes and resources"
      );

    const validFields = ["name", "email", "password", "role"];
    const requestedFields = req.body;
    console.log(requestedFields);

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} are invalid, ${
          missingFields ? missingFields : ""
        } are missing`
      );

    if (await User.findOne({ email: requestedFields.email }))
      throw new ApiError(409, "user or doctor already exists with this email");

    const otp = otpGenerator();
    const userId = crypto.randomUUID();
    const newUser = await User.create({ otp, userId, ...requestedFields });

    if (!newUser) throw new ApiError(500, "doctor creation unsuccessful");

    const mailOptions = {
      from: process.env.EMAIL || "",
      to: newUser.email,
      subject: "Account Verification OTP",
      text: `Name: ${newUser.name}\nEmail: ${newUser.email}\nMessage: Your OTP ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(201)
      .send(
        new ApiResponse(
          201,
          { name: newUser.name, email: newUser.email, role: newUser.role },
          "doctor registered successfully, please verify your account"
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

const verifyDocAccount = async (req, res) => {
  try {
    if (!req.user?._id) throw new ApiError(401, "invalid admin creds");

    if (!req.role !== "ADMIN")
      throw new ApiError(
        403,
        "you are forbidden to access admin routes and resources"
      );

    const validFields = ["email", "otp", "password"];
    const requestedFields = req.body;

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} are invalid, ${
          missingFields ? missingFields : ""
        } are missing`
      );

    const user = await User.findOne({
      email: requestedFields.email,
    });

    if (!user)
      throw new ApiError(404, "doctor/user with email not found in the system");

    if (user.role !== "DOCTOR")
      throw new ApiError(
        401,
        "user found but with their role is not 'DOCTOR' "
      );

    const isPasswordValid = await user.isPasswordCorrect(
      requestedFields.password
    );
    if (!isPasswordValid)
      throw new ApiError(
        400,
        "invalid password/ please send correct password as they'll be sent to doctor as credentials"
      );

    if (user.otp != requestedFields.otp)
      throw new ApiError(400, "invalid/wrong otp");

    user.isActive = true;
    user.isVerified = true;
    await user.save();

    await User.findByIdAndUpdate(user?._id, {
      $unset: {
        otp: 1,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL || "",
      to: user.email,
      subject: "Account Verification Successful",
      text: `Message: Doctor's account has be verified successfully and credentials are below \nName: ${user.name}\nEmail: ${user.email}\n Password:${requestedFields.password}`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .send(
        new ApiResponse(200, {}, "doctor verified successfully and credentials")
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

const disableDocter = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "ADMIN")
      throw new ApiError(401, "invalid user credentials");

    const { userId } = req.params;

    if (!userId) throw new ApiError(400, "no user/doc's id selected");

    const disabledDoc = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          isDisabledByAdmin: true,
        },
      },
      { new: true }
    );

    if (!disabledDoc)
      throw new ApiError(404, "doctor with selected id not found");

    return res.status(200).send(
      new ApiResponse(200, {
        doc_userId: disabledDoc.userId,
        disabled: disabledDoc.isDisabledByAdmin,
      })
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

// deleting the doc's data isn't a good practice at all as it will cause problems in finding user's prescriptions and also cause problems in bookings in future
const deleteDoctor = async (req, res) => {
  try {
    if (!req.user?._id || req.role !== "ADMIN")
      throw new ApiError(401, "invalid user credentials");

    const userId = req.params.docId;

    const docMetaData = await User.findOneAndDelete({ userId });

    const docDetails = await DocDetails.findOneAndDelete({
      userRef: docMetaData?._id,
    });

    const dayArr = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THRUSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    const deletedSlots = [];

    for (let i = 0; i < dayArr.length; i++) {
      const slot = await Timeslots.findOneAndDelete({
        docRef: docMetaData?._id,
        availableDay: dayArr[i],
      });

      deletedSlots.push(slot);
    }

    if (deletedSlots.length !== dayArr.length)
      throw new ApiError(500, "unable to delete all the doc's timeslots");

    return res
      .status(200)
      .send(
        new ApiResponse(
          204,
          {},
          "all the doctor's details, meta data deleted successfully "
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

module.exports = { disableDocter, doctorRegister, verifyDocAccount };
