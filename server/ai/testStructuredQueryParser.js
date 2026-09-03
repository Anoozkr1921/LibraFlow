const {
    parseStructuredQuery,
} = require("./structuredQueryParser");


const questions = [

    "Which books are written by Robert C. Martin?",

    "Show me books by Andrew Hunt & David Thomas",

    "Find books with ISBN 9780132350884",

    "Which books have category Programming?",

];


questions.forEach((question) => {
    console.log("\nQuestion:", question);
    console.log(
        "Parsed:",
        parseStructuredQuery(question)
    );

});