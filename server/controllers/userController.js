const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
} = require("../services/userService");


const getAllUsers = asyncHandler(async (req, res) => {

    const users = await getAllUsersService(
        req.query
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully.",
            users
        )
    );
});

const getUserById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const user = await getUserByIdService(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully.",
            user
        )
    );
});

const updateUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const user = await updateUserService(
        id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "User updated successfully.",
            user
        )
    );
});

const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result = await deleteUserService(
        id,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            result.message,
            null
        )
    );
});

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};