const {
    detectQueryType,
} = require("./queryRouter");

const questions = [
    "What books do you have?",
    "Which programming books are available?",
    "Which books are written by Robert C. Martin?",
    "What is the best book for learning software development?",
    "Tell me about Clean Code",
];
questions.forEach((question) => {
    console.log(
        question,
        "=>",
        detectQueryType(question)
    );

});