const Conversation = require("../models/conversationModel");
const ApiError = require("../utils/ApiError");

// ---------------------------------------
// Get user's conversations
// ---------------------------------------

const getUserConversations = async (
    req,
    res,
    next
) => {
    try {
        const userId = req.user._id;
        const conversations =
            await Conversation.find({
                userId,
            })
                .sort({
                    updatedAt: -1,
                })
                .select(
                    "conversationId messages createdAt updatedAt"
                )
                .lean();

        // ---------------------------------------
        // Return lightweight conversation history
        // ---------------------------------------

        const result =
            conversations.map(
                (conversation) => {
                    const messages =
                        conversation.messages || [];

                    const firstUserMessage =
                        messages.find(
                            (message) =>
                                message.role === "user"
                        );

                    const lastMessage =
                        messages.length > 0
                            ? messages[
                                  messages.length - 1
                              ]
                            : null;

                    return {

                        conversationId:
                            conversation.conversationId,

                        title:
                            firstUserMessage
                                ?.content ||
                            "New Conversation",

                        lastMessage:
                            lastMessage?.content ||
                            "",

                        messageCount:
                            messages.length,

                        createdAt:
                            conversation.createdAt,

                        updatedAt:
                            conversation.updatedAt,
                    };
                }
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------
// Get single conversation
// ---------------------------------------

const getConversation = async (
    req,
    res,
    next
) => {
    try {
        const {
            conversationId,
        } = req.params;
        const userId =
            req.user._id;

        const conversation =
            await Conversation.findOne({
                conversationId,
                userId,
            }).lean();
        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found."
            );
        }
        return res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------
// Delete conversation
// ---------------------------------------

const deleteConversation = async (
    req,
    res,
    next
) => {
    try {
        const {
            conversationId,
        } = req.params;
        const userId =
            req.user._id;

        const conversation =
            await Conversation.findOneAndDelete({
                conversationId,
                userId,

            });

        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found."
            );
        }
        return res.status(200).json({
            success: true,
            message:
                "Conversation deleted successfully.",

        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserConversations,
    getConversation,
    deleteConversation,

};