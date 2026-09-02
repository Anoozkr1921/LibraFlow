const chatModel = require("../ai/chatModel");

const {
    retrieveBooks,
} = require("../ai/retriever");

const {
    createLibraryPrompt,
} = require("../ai/prompts");

const chatWithLibrary = async (question) => {
    const books = await retrieveBooks(question);

    let context = "";
    if (books.length === 0) {
        context = "No relevant books were found in the library database.";
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

    const prompt = createLibraryPrompt(
        question,
        context
    );

    const response = await chatModel.invoke(
        prompt
    );

    return {
        answer: response.content,
        sources: books,
    };
};


module.exports = {
    chatWithLibrary,
};