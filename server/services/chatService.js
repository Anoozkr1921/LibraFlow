const chatModel = require("../ai/chatModel");

const {
    retrieveBooksByVector,
} = require("../ai/vectorRetriever");

const {
    createLibraryPrompt,
} = require("../ai/prompts");

const {
    detectQueryType,
} = require("../ai/queryRouter");

const {
    retrieveAllBooks,
} = require("../ai/inventoryRetriever");

const {
    parseStructuredQuery,
} = require("../ai/structuredQueryParser");

const {
    searchBooks,
} = require("../ai/structuredRetriever");

const {
    resolveBookEntity,
} = require("../ai/bookEntityResolver");

const {
    getHistory,
    addMessage,
} = require("../ai/chatMemory");

const chatWithLibrary = async (question , conversationId) => {

    const history = getHistory(conversationId);

    // ---------------------------------------
    // STEP 1: Detect availability request
    // ---------------------------------------

    const availabilityKeywords = [
        "available",
        "availability",
        "borrow",
        "borrowable",
        "can i borrow",
    ];

    const lowerQuestion = question.toLowerCase();

    const availableOnly = availabilityKeywords.some(
        (keyword) =>
            lowerQuestion.includes(keyword)
    );

    const queryType = detectQueryType(question);
    const resolvedBook = await resolveBookEntity(question);

    let books;

    if (resolvedBook) {
        books = [resolvedBook];
    }

    else if (queryType === "inventory") {
        books = await retrieveAllBooks();

    }

    else if (queryType === "availability") {
        books = await retrieveBooksByVector(
            question,
            true
        );

    }

    else if (queryType === "structured") {
        const filters =
            parseStructuredQuery(question);

        books = await searchBooks(filters);

    }


    // ---------------------------------------
    // SEMANTIC SEARCH
    // ---------------------------------------

    else {

        books = await retrieveBooksByVector(
            question,
            false
        );

    }

    // Creating context

    let context = "";

    if (books.length === 0) {

        context =
            "No relevant books were found in the library database.";

    } else {

        context = books
            .map((book, index) => {

                return `
Book ${index + 1}:

Title: ${book.title}
Author: ${book.author}
ISBN: ${book.isbn || "Not available"}
Category: ${book.category}
Description: ${book.description || "Not available"}
Publisher: ${book.publisher || "Not available"}
Published Year: ${book.publishedYear || "Not available"}
Language: ${book.language || "Not available"}
Available Copies: ${book.availableCopies}
Location: ${book.location || "Not available"}
`;

            })
            .join("\n");
    }


    // ---------------------------------------
    // STEP 4: Create prompt
    // ---------------------------------------

    const prompt = createLibraryPrompt(
        question,
        context,
        history
    );


    // ---------------------------------------
    // STEP 5: Ask Gemini
    // ---------------------------------------

    const response = await chatModel.invoke(
        prompt
    );

    addMessage(
        conversationId,
        "user",
        question
    );

    addMessage(
        conversationId,
        "assistant",
        response.content
    );


    // ---------------------------------------
    // STEP 6: Return answer + sources
    // ---------------------------------------

    return {

        answer: response.content,

        sources: books.map((book) => ({
            id: book._id,
            title: book.title,
            author: book.author,
            category: book.category,
            availableCopies: book.availableCopies,
            location: book.location,
            score: book.score,
        })),

    };
};


module.exports = {
    chatWithLibrary,
};