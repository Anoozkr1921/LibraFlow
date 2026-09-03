const Conversation = require("../models/conversationModel");


// ---------------------------------------
// Get conversation history
// ---------------------------------------

const getHistory = async (
    conversationId,
    userId
) => {

    if (!conversationId || !userId) {
        return [];
    }

    const conversation =
        await Conversation.findOne({
            conversationId,
            userId,
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
    conversationId,
    userId
) => {

    if (!conversationId || !userId) {
        return null;
    }

    const conversation =
        await Conversation.findOne({
            conversationId,
            userId,
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
    userId,
    role,
    content,
    sources = []
) => {

    if (!conversationId || !userId) {
        return;
    }

    // ---------------------------------------
    // Find user's conversation
    // ---------------------------------------

    let conversation =
        await Conversation.findOne({
            conversationId,
            userId,
        });


    // ---------------------------------------
    // Create conversation
    // ---------------------------------------

    if (!conversation) {

        conversation =
            new Conversation({
                conversationId,
                userId,
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
        Array.isArray(sources) &&
        sources.length > 0
    ) {

        conversation.lastReferencedBook =
            sources[0];
    }


    // ---------------------------------------
    // Save conversation
    // ---------------------------------------

    await conversation.save();
};


// ---------------------------------------
// Set last referenced book
// ---------------------------------------

const setLastReferencedBook = async (
    conversationId,
    userId,
    book
) => {

    if (
        !conversationId ||
        !userId ||
        !book
    ) {
        return;
    }

    await Conversation.findOneAndUpdate(
        {
            conversationId,
            userId,
        },

        {
            $set: {
                lastReferencedBook: {
                    id: book.id || book._id,
                    title: book.title,
                    author: book.author,
                    category: book.category,
                    availableCopies:
                        book.availableCopies,
                    location: book.location,
                    score: book.score,
                },
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