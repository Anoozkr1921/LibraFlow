const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        messages: [
            {
                role: {
                    type: String,
                    enum: ["user", "assistant"],
                    required: true,
                },

                content: {
                    type: String,
                    required: true,
                },

                sources: [
                    {
                        id: mongoose.Schema.Types.ObjectId,
                        title: String,
                        author: String,
                        category: String,
                        availableCopies: Number,
                        location: String,
                        score: Number,
                    },
                ],
            },
        ],

        lastReferencedBook: {
            id: mongoose.Schema.Types.ObjectId,
            title: String,
            author: String,
            category: String,
            availableCopies: Number,
            location: String,
            score: Number,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Conversation",
    conversationSchema
);