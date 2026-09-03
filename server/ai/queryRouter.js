const detectQueryType = (question) => {
    const q = question.toLowerCase().trim();

    const inventoryPatterns = [
        "what books do you have",
        "what books are there",
        "what books are in the library",
        "list all books",
        "show all books",
        "all books",
        "books in the library",
    ];

    if (
        inventoryPatterns.some(
            (pattern) => q.includes(pattern)
        )
    ) {
        return "inventory";
    }

    const availabilityPatterns = [
        "available",
        "availability",
        "can i borrow",
        "can i get",
        "borrow",
        "borrowable",
    ];

    if (
        availabilityPatterns.some(
            (pattern) => q.includes(pattern)
        )
    ) {
        return "availability";
    }

    return "semantic";
};


module.exports = {
    detectQueryType,
};