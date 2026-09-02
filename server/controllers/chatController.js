const {
    chatWithLibrary,
} = require("../services/chatService");

const chatController = async (req, res, next) => {
    try {
        const { question } = req.body;
        // Validate question
        if (!question || question.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Question is required.",
            });
        }
        const result = await chatWithLibrary(
            question
        );
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