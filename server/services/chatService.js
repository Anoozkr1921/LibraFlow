const chatModel = require("../ai/chatModel");

const {
    retrieveBooksByVector,
} = require("../ai/vectorRetriever");

const {
    createLibraryPrompt,
} = require("../ai/prompts");


const chatWithLibrary = async (question) => {

    // ---------------------------------------
    // STEP 1: Retrieve relevant books
    // ---------------------------------------

    const books = await retrieveBooksByVector(question);

    // ---------------------------------------
    // STEP 2: Create context
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
    // STEP 3: Create prompt
    // ---------------------------------------

    const prompt = createLibraryPrompt(
        question,
        context
    );


    // ---------------------------------------
    // STEP 4: Ask Gemini
    // ---------------------------------------

    const response = await chatModel.invoke(
        prompt
    );


    // ---------------------------------------
    // STEP 5: Return answer + sources
    // ---------------------------------------

    return {

        answer: response.content,

        sources: books.map((book) => ({
            id: book._id,
            title: book.title,
            author: book.author,
            category: book.category,
        })),

    };
};


module.exports = {
    chatWithLibrary,
};