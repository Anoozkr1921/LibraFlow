const chatModel = require("../ai/chatModel");

const {
    retrieveBooksByVector,
} = require("../ai/vectorRetriever");

const {
    createLibraryPrompt,
} = require("../ai/prompts");


const chatWithLibrary = async (question) => {

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


    // ---------------------------------------
    // STEP 2: Retrieve relevant books
    // ---------------------------------------

    const books = await retrieveBooksByVector(
        question,
        availableOnly
    );


    // ---------------------------------------
    // STEP 3: Create context
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
    // STEP 4: Create prompt
    // ---------------------------------------

    const prompt = createLibraryPrompt(
        question,
        context
    );


    // ---------------------------------------
    // STEP 5: Ask Gemini
    // ---------------------------------------

    const response = await chatModel.invoke(
        prompt
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