const conversations = new Map();

const getHistory = (userId) => {
    return conversations.get(userId) || [];
};

const addMessage = (userId, role, content) => {

    if (!conversations.has(userId)) {
        conversations.set(userId, []);
    }

    conversations.get(userId).push({
        role,
        content,
    });
};

module.exports = {
    getHistory,
    addMessage,
};