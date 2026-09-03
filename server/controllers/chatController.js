const {
    chatWithLibrary,
} = require("../services/chatService");


const chatController = async (
    req,
    res,
    next
) => {

    try {

        // ---------------------------------------
        // Check authentication
        // ---------------------------------------

        if (!req.user || !req.user._id) {

            return res.status(401).json({
                success: false,
                message:
                    "Unauthorized. Please login again.",
            });

        }


        // ---------------------------------------
        // Get request data
        // ---------------------------------------

        const {
            question,
            conversationId,
        } = req.body;


        // ---------------------------------------
        // Validate question
        // ---------------------------------------

        if (
            !question ||
            question.trim() === ""
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Question is required.",
            });

        }


        // ---------------------------------------
        // Validate conversation ID
        // ---------------------------------------

        if (!conversationId) {

            return res.status(400).json({
                success: false,
                message:
                    "conversationId is required.",
            });

        }


        // ---------------------------------------
        // Get authenticated user ID
        // ---------------------------------------

        const userId =
            req.user._id;


        // ---------------------------------------
        // Chat service
        // ---------------------------------------

        const result =
            await chatWithLibrary(
                question,
                conversationId,
                userId
            );


        // ---------------------------------------
        // Response
        // ---------------------------------------

        return res.status(200).json({

            success: true,

            data: result,

        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    chatController,
};