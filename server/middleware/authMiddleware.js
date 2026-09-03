const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {

    let token;

    // ---------------------------------------
    // Get token from Authorization header
    // ---------------------------------------

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token =
            req.headers.authorization.split(" ")[1];
    }

    // ---------------------------------------
    // Fallback: get token from cookie
    // ---------------------------------------

    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    // ---------------------------------------
    // Token missing
    // ---------------------------------------

    if (!token) {
        throw new ApiError(
            401,
            "Unauthorized. Please login."
        );
    }

    // ---------------------------------------
    // Verify JWT
    // ---------------------------------------

    const decoded =
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

    // ---------------------------------------
    // Find user
    // ---------------------------------------

    const user =
        await User.findById(decoded.id)
            .select("-password");

    if (!user) {
        throw new ApiError(
            401,
            "User not found."
        );
    }

    // ---------------------------------------
    // Attach user to request
    // ---------------------------------------

    req.user = user;

    next();
});

module.exports = verifyJWT;