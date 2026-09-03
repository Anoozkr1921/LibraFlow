require("dotenv").config();

const mongoose = require("mongoose");

const {
    retrieveBooksByVector,
} = require("./vectorRetriever");

const test = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );
        console.log("MongoDB connected");
        const question =
            "Which books can help me write better software?";

        const books =
            await retrieveBooksByVector(question);

        console.log("\nRetrieved books:\n");

        books.forEach((book, index) => {
            console.log(
                `${index + 1}. ${book.title}`
            );
            console.log(
                `Author: ${book.author}`
            );
            console.log(
                `Category: ${book.category}`
            );
            console.log(
                `Score: ${book.score}`
            );
            console.log("----------------------");
        });
        await mongoose.disconnect();
    } 
    catch (error) {
        console.error(
            "Vector search error:",
            error
        );
    }
};

test();