const Conversation = require("../models/conversationModel");


// ---------------------------------------
// Get conversation history
// ---------------------------------------

const getHistory = async (conversationId) => {

    if (!conversationId) {
        return [];
    }

    const conversation =
        await Conversation.findOne({
            conversationId,
        }).lean();

    if (!conversation) {
        return [];
    }

    return conversation.messages || [];
};


// ---------------------------------------
// Get last referenced book
// ---------------------------------------

const getLastReferencedBook = async (
    conversationId
) => {

    if (!conversationId) {
        return null;
    }

    const conversation =
        await Conversation.findOne({
            conversationId,
        }).lean();

    if (!conversation) {
        return null;
    }

    return conversation.lastReferencedBook || null;
};


// ---------------------------------------
// Add message
// ---------------------------------------

const addMessage = async (
    conversationId,
    role,
    content,
    sources = []
) => {

    if (!conversationId) {
        return;
    }


    // ---------------------------------------
    // Find existing conversation
    // ---------------------------------------

    let conversation =
        await Conversation.findOne({
            conversationId,
        });


    // ---------------------------------------
    // Create conversation if necessary
    // ---------------------------------------

    if (!conversation) {

        conversation =
            new Conversation({
                conversationId,
                messages: [],
                lastReferencedBook: null,
            });
    }


    // ---------------------------------------
    // Add message
    // ---------------------------------------

    conversation.messages.push({
        role,
        content,
        sources,
    });


    // ---------------------------------------
    // Update last referenced book
    // ---------------------------------------

    if (
        role === "assistant" &&
        sources &&
        sources.length > 0
    ) {

        conversation.lastReferencedBook =
            sources[0];
    }


    // ---------------------------------------
    // Save to MongoDB
    // ---------------------------------------

    await conversation.save();
};


// ---------------------------------------
// Set last referenced book
// ---------------------------------------

const setLastReferencedBook = async (
    conversationId,
    book
) => {

    if (!conversationId || !book) {
        return;
    }


    await Conversation.findOneAndUpdate(
        {
            conversationId,
        },

        {
            $set: {
                lastReferencedBook: book,
            },
        },

        {
            upsert: true,
            new: true,
        }
    );
};


module.exports = {
    getHistory,
    addMessage,
    getLastReferencedBook,
    setLastReferencedBook,
};