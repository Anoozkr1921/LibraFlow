const Book = require("../models/Book");

const embeddings = require("./embeddingModel");

const retrieveBooksByVector = async (question) => {

    // 1. Convert user question into embedding
    const queryVector = await embeddings.embedQuery(
        question
    );

    // 2. Perform MongoDB Vector Search
    const books = await Book.aggregate([
        {
            $vectorSearch: {
                index: "book_vector_index",
                path: "embedding",
                queryVector: queryVector,
                numCandidates: 50,
                limit: 5,
                filter: {
                    isDeleted: false,
                },
            },
        },
        // 3. Return similarity score
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
    return books;
};
module.exports = {
    retrieveBooksByVector,
};