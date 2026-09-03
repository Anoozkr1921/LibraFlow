const {
    getLastReferencedBook,
    setLastReferencedBook,
} = require("./chatMemory");


const resolveBookReference = async (
    question,
    history,
    conversationId
) => {

    if (!question) {
        return null;
    }

    const lowerQuestion =
        question.toLowerCase().trim();


    // ---------------------------------------
    // Get previous assistant messages
    // that contain sources
    // ---------------------------------------

    const previousAssistantMessages =
        (history || []).filter(
            (message) =>
                message.role === "assistant" &&
                Array.isArray(message.sources) &&
                message.sources.length > 0
        );


    const previous =
        previousAssistantMessages.length > 0
            ? previousAssistantMessages[
                  previousAssistantMessages.length - 1
              ]
            : null;


    const sources =
        previous?.sources || [];


    let selectedBook = null;


    // ---------------------------------------
    // FIRST BOOK
    // ---------------------------------------

    if (
        lowerQuestion.includes("first one") ||
        lowerQuestion.includes("first book")
    ) {

        selectedBook =
            sources[0] || null;
    }


    // ---------------------------------------
    // SECOND BOOK
    // ---------------------------------------

    else if (
        lowerQuestion.includes("second one") ||
        lowerQuestion.includes("second book")
    ) {

        selectedBook =
            sources[1] || null;
    }


    // ---------------------------------------
    // THIRD BOOK
    // ---------------------------------------

    else if (
        lowerQuestion.includes("third one") ||
        lowerQuestion.includes("third book")
    ) {

        selectedBook =
            sources[2] || null;
    }


    // ---------------------------------------
    // LAST BOOK
    // ---------------------------------------

    else if (
        lowerQuestion.includes("last one") ||
        lowerQuestion.includes("last book")
    ) {

        if (sources.length > 0) {

            selectedBook =
                sources[sources.length - 1];
        }
    }


    // ---------------------------------------
    // Explicit reference:
    // "that book", "this book"
    // ---------------------------------------

    else if (
        lowerQuestion.includes("that book") ||
        lowerQuestion.includes("this book") ||
        lowerQuestion.includes("that one") ||
        lowerQuestion.includes("this one")
    ) {

        selectedBook =
            await getLastReferencedBook(
                conversationId
            );

        if (!selectedBook) {
            selectedBook =
                sources[0] || null;
        }
    }


    // ---------------------------------------
    // Pronoun reference:
    // "it", "its"
    // ---------------------------------------

    else if (
        lowerQuestion.includes("it ") ||
        lowerQuestion.includes("its ")
    ) {

        selectedBook =
            await getLastReferencedBook(
                conversationId
            );

        if (!selectedBook) {
            selectedBook =
                sources[0] || null;
        }
    }


    // ---------------------------------------
    // Save newly selected book
    // ---------------------------------------

    if (
        selectedBook &&
        conversationId
    ) {

        await setLastReferencedBook(
            conversationId,
            selectedBook
        );
    }


    return selectedBook;
};


module.exports = {
    resolveBookReference,
};