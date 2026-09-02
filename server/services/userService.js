const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");


// ======================================================
// GET ALL USERS
// Search + Role Filter + Pagination
// ======================================================

const getAllUsersService = async (queryParams) => {

    const {
        search,
        role,
        page = 1,
        limit = 10,
    } = queryParams;


    // ------------------------------------------
    // Build query
    // ------------------------------------------

    const query = {};


    // ------------------------------------------
    // Search by name or email
    // ------------------------------------------

    if (search && search.trim() !== "") {

        query.$or = [

            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];
    }


    // ------------------------------------------
    // Filter by role
    // ------------------------------------------

    if (
        role &&
        ["student", "admin"].includes(role)
    ) {

        query.role = role;
    }


    // ------------------------------------------
    // Pagination
    // ------------------------------------------

    const pageNumber = Math.max(
        Number(page) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const skip =
        (pageNumber - 1) * limitNumber;


    // ------------------------------------------
    // Get users
    // ------------------------------------------

    const users = await User.find(query)

        // IMPORTANT:
        // Never send password to frontend

        .select("-password")

        .sort({
            createdAt: -1,
        })

        .skip(skip)

        .limit(limitNumber);


    // ------------------------------------------
    // Total users
    // ------------------------------------------

    const totalUsers =
        await User.countDocuments(query);


    // ------------------------------------------
    // Total pages
    // ------------------------------------------

    const totalPages = Math.ceil(
        totalUsers / limitNumber
    );


    return {

        users,

        pagination: {

            page: pageNumber,

            limit: limitNumber,

            totalUsers,

            totalPages,

            hasNextPage:
                pageNumber < totalPages,

            hasPreviousPage:
                pageNumber > 1,
        },
    };
};



// ======================================================
// GET USER BY ID
// ======================================================

const getUserByIdService = async (id) => {

    // Validate MongoDB ObjectId

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid user ID."
        );
    }


    const user = await User.findById(id)
        .select("-password");


    if (!user) {

        throw new ApiError(
            404,
            "User not found."
        );
    }


    return user;
};



// ======================================================
// UPDATE USER
// ======================================================

const updateUserService = async (id, data) => {

    // Validate ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid user ID."
        );
    }


    // Fields that admin is allowed to update

    const updateData = {};


    if (data.name !== undefined) {
        updateData.name = data.name;
    }


    if (data.role !== undefined) {

        if (
            !["student", "admin"].includes(data.role)
        ) {

            throw new ApiError(
                400,
                "Invalid role."
            );
        }

        updateData.role = data.role;
    }


    if (data.isVerified !== undefined) {
        updateData.isVerified = data.isVerified;
    }


    if (data.profileImage !== undefined) {
        updateData.profileImage = data.profileImage;
    }


    // Update user

    const user = await User.findByIdAndUpdate(

        id,

        updateData,

        {
            new: true,
            runValidators: true,
        }

    ).select("-password");


    if (!user) {

        throw new ApiError(
            404,
            "User not found."
        );
    }


    return user;
};



// ======================================================
// DELETE USER
// ======================================================

const deleteUserService = async (id, currentUserId) => {

    // Validate ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid user ID."
        );
    }


    // Prevent admin from deleting themselves

    if (
        currentUserId.toString() === id.toString()
    ) {

        throw new ApiError(
            400,
            "You cannot delete your own account."
        );
    }


    const user = await User.findByIdAndDelete(id);


    if (!user) {

        throw new ApiError(
            404,
            "User not found."
        );
    }


    return {
        message: "User deleted successfully.",
    };
};
module.exports = {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
};