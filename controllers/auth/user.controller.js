const { fieldValidator } = require("../../helper/fieldvalidator.helper");
const User = require("../../models/user.model");
const crypto = require("crypto");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");
const { transporter } = require("../../utils/nodemailer");
const { otpGenerator } = require("../../utils/otpGenerator");

const userRegister = async (req, res) => {
  try {
    const validFields = ["name", "email", "password"];
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

    if (
      await User.findOne({
        name: requestedFields.name,
        email: requestedFields.email,
      })
    )
      throw new ApiError(409, "user already exists with name and email");

    const otp = otpGenerator();
    const userId = crypto.randomUUID();
    const newUser = await User.create({ otp, userId, ...requestedFields });

    if (!newUser) throw new ApiError(500, "user creation unsuccessful");

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
          { name: newUser.name, email: newUser.email },
          "user registered successfully, please verify your account"
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

const verifyAccount = async (req, res) => {
  try {
    const validFields = ["name", "email", "otp"];
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
      throw new ApiError(404, "user with email not found in the system");

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
      to: newUser.email,
      subject: "Account Verification Successful",
      text: `Name: ${newUser.name}\nEmail: ${newUser.email}\nMessage: Your account has be verified successfully `,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .send(new ApiResponse(200, {}, "user verified successfully"));
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

const userLogin = async (req, res) => {
  try {
    const validFields = ["email", "password"];
    const requestedFields = req.body;

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    console.log(invalidFields, missingFields);

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} are invalid, ${
          missingFields ? missingFields : ""
        } are missing`
      );

    const user = await User.findOne({
      email: requestedFields.email,
    }).select(" -_id -__v -updatedAt");

    if (!user)
      throw new ApiError(
        404,
        "user with email and username not found in the system"
      );

    if (!user.isVerified || !user.isActive)
      throw new ApiError(
        403,
        "user with eamil and password is not verified or inactive, please verify or reactivate your account"
      );

    const isPasswordValid = await user.isPasswordCorrect(
      requestedFields.password
    );

    if (!isPasswordValid) throw new ApiError(400, "invalid/wrong password");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
    };

    const accessToken = await user.generateAccessToken();

    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .send(
        new ApiResponse(
          200,
          { name: user.name, email: user.email, role: user.role },
          "user logged in successfully"
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

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user?._id)
      throw new ApiError(401, "unauthorized user");

    req.user._id = null;
    req.user.upadtedAt = null;

    return res
      .status(200)
      .send(
        new ApiResponse(200, req.user, "current user fetched successfully")
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

module.exports = { userRegister, verifyAccount, userLogin, getCurrentUser };
