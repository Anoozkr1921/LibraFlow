const Book = require("../models/Book");

const embeddings = require("./embeddingModel");

const retrieveBooksByVector = async (question, availableOnly = false) => {

    const queryVector = await embeddings.embedQuery(question);

    const vectorSearch = {
        index: "book_vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 50,
        limit: 5,
    };

    if (availableOnly) {
        vectorSearch.filter = {
            isDeleted: false,
            availableCopies: {
                $gt: 0,
            },
        };
    } else {
        vectorSearch.filter = {
            isDeleted: false,
        };
    }

    const books = await Book.aggregate([
        {
            $vectorSearch: vectorSearch,
        },

        {
            $project: {
                title: 1,
                author: 1,
                isbn: 1,
                category: 1,
                description: 1,
                publisher: 1,
                publishedYear: 1,
                language: 1,
                availableCopies: 1,
                location: 1,

                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },
    ]);

    const relevantBooks = books.filter(
        (book) => book.score >= 0.80
    );

    return relevantBooks;
};

module.exports = {
    retrieveBooksByVector,
};
module.exports = {
    retrieveBooksByVector,
};