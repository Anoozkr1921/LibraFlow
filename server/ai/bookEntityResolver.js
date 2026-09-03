const Book = require("../models/Book");

const resolveBookEntity = async (question) => {

    const words = question
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    // Try combinations of words from longest to shortest
    for (let length = words.length; length >= 2; length--) {

        for (let i = 0; i <= words.length - length; i++) {

            const possibleTitle = words
                .slice(i, i + length)
                .join(" ");

            const book = await Book.findOne({
                title: {
                    $regex: `^${possibleTitle}$`,
                    $options: "i",
                },
                isDeleted: false,
            });

            if (book) {
                return book;
            }
        }
    }

    return null;
};

module.exports = {
    resolveBookEntity,
};