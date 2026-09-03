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

const {
    resolveBookReference,
} = require("../ai/referenceResolver");


const chatWithLibrary = async (
    question,
    conversationId,
    userId 
) => {

    // ---------------------------------------
    // STEP 1: Get conversation history
    // ---------------------------------------

    const history = await getHistory(conversationId , userId);


    // ---------------------------------------
    // STEP 2: Resolve conversational reference
    // ---------------------------------------

    const referencedBook =
        await resolveBookReference(
            question,
            history,
            conversationId, 
            userId
        );


    // ---------------------------------------
    // STEP 3: Detect query type
    // ---------------------------------------

    const queryType =
        detectQueryType(question);


    // ---------------------------------------
    // STEP 4: Resolve exact book entity
    // ---------------------------------------

    const resolvedBook =
        await resolveBookEntity(question);


    let books;


    // ---------------------------------------
    // STEP 5: Conversational reference
    // ---------------------------------------

    if (referencedBook) {

        books = await searchBooks({
            title: referencedBook.title,
        });

        // Fallback if structured title search
        // doesn't find the book
        if (books.length === 0) {
            books = [referencedBook];
        }
    }


    // ---------------------------------------
    // STEP 6: Exact book entity
    // ---------------------------------------

    else if (resolvedBook) {

        books = [resolvedBook];

    }


    // ---------------------------------------
    // STEP 7: Inventory query
    // ---------------------------------------

    else if (queryType === "inventory") {

        books =
            await retrieveAllBooks();

    }


    // ---------------------------------------
    // STEP 8: Availability query
    // ---------------------------------------

    else if (queryType === "availability") {

        books =
            await retrieveBooksByVector(
                question,
                true
            );

    }


    // ---------------------------------------
    // STEP 9: Structured query
    // ---------------------------------------

    else if (queryType === "structured") {

        const filters =
            parseStructuredQuery(question);

        books =
            await searchBooks(filters);

    }


    // ---------------------------------------
    // STEP 10: Semantic / Vector search
    // ---------------------------------------

    else {

        books =
            await retrieveBooksByVector(
                question,
                false
            );

    }


    // ---------------------------------------
    // STEP 11: Create context
    // ---------------------------------------

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
    // STEP 12: Create prompt
    // ---------------------------------------

    const prompt =
        createLibraryPrompt(
            question,
            context,
            history
        );


    // ---------------------------------------
    // STEP 13: Ask Gemini
    // ---------------------------------------

    const response =
        await chatModel.invoke(prompt);


    // ---------------------------------------
    // STEP 14: Prepare sources
    // ---------------------------------------

    const sources =
        books.map((book) => ({

            id: book._id,
            title: book.title,
            author: book.author,
            category: book.category,
            availableCopies:
                book.availableCopies,
            location: book.location,
            score: book.score,

        }));


    // ---------------------------------------
    // STEP 15: Save conversation
    // ---------------------------------------

    await addMessage(
        conversationId,
        userId,
        "user",
        question
    );

    await addMessage(
        conversationId,
        userId,
        "assistant",
        response.content,
        sources
    );


    // ---------------------------------------
    // STEP 16: Return response
    // ---------------------------------------

    return {
        answer: response.content,
        sources,

    };
};


module.exports = {
    chatWithLibrary,
};