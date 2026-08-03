const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {
    let token;

    // Read token from cookie
    if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // Or from Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(401, "Unauthorized. Please login.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    req.user = user;

    next();
});

module.exports = verifyJWT;