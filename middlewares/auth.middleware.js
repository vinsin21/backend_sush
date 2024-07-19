const User = require("../models/user.model");

const verifyJwt = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "invalid access token");
    req.user = user;
    req.role = role;
    next();
  } catch (error) {
    return res
      .status(error?.statusCode || 401)
      .send(
        new ApiError(
          error.statusCode || 401,
          error?.message || "unauthorised user"
        )
      );
  }
};

module.exports = { verifyJwt };
