const {
    chatWithLibrary,
} = require("../services/chatService");


const chatController = async (
    req,
    res,
    next
) => {

    try {

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
                message: "Question is required.",
            });

        }


        // ---------------------------------------
        // Validate conversationId
        // ---------------------------------------

        if (!conversationId) {

            return res.status(400).json({
                success: false,
                message:
                    "conversationId is required.",
            });

        }


        // ---------------------------------------
        // Get logged-in user
        // ---------------------------------------

        const userId = req.user._id;


        // ---------------------------------------
        // Chat with library
        // ---------------------------------------

        const result =
            await chatWithLibrary(
                question,
                conversationId,
                userId
            );


        // ---------------------------------------
        // Send response
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