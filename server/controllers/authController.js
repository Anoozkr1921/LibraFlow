const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    registerUser,
    verifyEmailService,
    loginUser,
} = require("../services/authService");

const register = asyncHandler(async (req, res) => {

    const { user } = await registerUser(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        )
    );

});

const verifyEmail = asyncHandler(async (req, res) => {

    const { token } = req.params;

    const result = await verifyEmailService(token);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Email verified successfully",
            result
        )
    );

});

const login = asyncHandler(async (req, res) => {

    const { user, token } = await loginUser(req.body);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            }
        )
    );

});

module.exports = {
    register,
    verifyEmail,
    login,
};