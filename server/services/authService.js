const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User");
const Token = require("../models/Token");
const ApiError = require("../utils/ApiError");

const { sendVerificationEmail } = require("./emailService");

const registerUser = async ({ name, email, password }) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

    await Token.create({
        user: user._id,
        token: verificationToken,
        type: "verify-email",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendVerificationEmail(
        user.name,
        user.email,
        verificationToken
    );

    return {
        user,
        verificationToken,
    };
};

const verifyEmailService = async (tokenValue) => {

    const token = await Token.findOne({
        token: tokenValue,
        type: "verify-email",
    });

    if (!token) {
        throw new ApiError(400, "Invalid verification token.");
    }

    if (token.expiresAt < new Date()) {

        await Token.deleteOne({
            _id: token._id,
        });

        throw new ApiError(
            400,
            "Verification token has expired."
        );
    }

    const user = await User.findById(token.user);

    if (!user) {

        await Token.deleteOne({
            _id: token._id,
        });

        throw new ApiError(
            404,
            "User not found."
        );
    }

    if (user.isVerified) {

        await Token.deleteOne({
            _id: token._id,
        });

        return {
            message: "Email already verified.",
        };
    }

    user.isVerified = true;

    await user.save();

    await Token.deleteOne({
        _id: token._id,
    });

    return {
        message: "Email verified successfully.",
    };
};

module.exports = {
    registerUser,
    verifyEmailService,
};