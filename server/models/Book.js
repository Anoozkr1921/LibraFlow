const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            required: true,
        },

        publisher: {
            type: String,
            default: "",
        },

        publishedYear: {
            type: Number,
        },

        language: {
            type: String,
            default: "English",
        },

        totalCopies: {
            type: Number,
            required: true,
            min: 1,
        },

        availableCopies: {
            type: Number,
            required: true,
        },

        coverImage: {
            type: String,
            default: "",
        },

        coverImagePublicId: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        embedding: {
            type: [Number],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Book", bookSchema);