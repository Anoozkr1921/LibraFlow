const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        borrowDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        returnDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["borrowed", "returned", "overdue"],
            default: "borrowed",
        },

        fine: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Borrow", borrowSchema);