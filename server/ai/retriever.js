const Book = require("../models/Book");

const retrieveBooks = async (question) => {
    // Convert question to lowercase
    const searchText = question
        .toLowerCase()
        .trim();

    if (!searchText) {
        return [];
    }

    const words = searchText
        .split(/\s+/)
        .filter((word) => word.length > 2);


    const regexPatterns = words.map(
        (word) => new RegExp(word, "i")
    );

    const books = await Book.find({
        isDeleted: false,

        $or: regexPatterns.flatMap((regex) => [
            { title: regex },
            { author: regex },
            { category: regex },
            { description: regex },
            { publisher: regex },
        ]),
    })
        .select(
            "title author category description publisher publishedYear language availableCopies location"
        )
        .limit(5);

    return books;
};

module.exports = {
    retrieveBooks,
};