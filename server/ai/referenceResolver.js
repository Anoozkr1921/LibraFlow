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
        question.toLowerCase();


    // ---------------------------------------
    // Find previous assistant response
    // containing sources
    // ---------------------------------------

    const previousAssistantMessages =
        (history || []).filter(
            (message) =>
                message.role === "assistant" &&
                message.sources &&
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


    // ---------------------------------------
    // FIRST BOOK
    // ---------------------------------------

    if (
        lowerQuestion.includes("first one") ||
        lowerQuestion.includes("first book")
    ) {

        const book = sources[0] || null;

        if (book && conversationId) {

            await setLastReferencedBook(
                conversationId,
                book
            );

        }

        return book;
    }


    // ---------------------------------------
    // SECOND BOOK
    // ---------------------------------------

    if (
        lowerQuestion.includes("second one") ||
        lowerQuestion.includes("second book")
    ) {

        const book = sources[1] || null;

        if (book && conversationId) {

            await setLastReferencedBook(
                conversationId,
                book
            );

        }

        return book;
    }


    // ---------------------------------------
    // THIRD BOOK
    // ---------------------------------------

    if (
        lowerQuestion.includes("third one") ||
        lowerQuestion.includes("third book")
    ) {

        const book = sources[2] || null;

        if (book && conversationId) {

            await setLastReferencedBook(
                conversationId,
                book
            );

        }

        return book;
    }


    // ---------------------------------------
    // LAST BOOK
    // ---------------------------------------

    if (
        lowerQuestion.includes("last one") ||
        lowerQuestion.includes("last book")
    ) {

        const book =
            sources.length > 0
                ? sources[sources.length - 1]
                : null;

        if (book && conversationId) {

            await setLastReferencedBook(
                conversationId,
                book
            );

        }

        return book;
    }


    // ---------------------------------------
    // "IT" / "ITS" / "THAT BOOK"
    // ---------------------------------------

    if (
        lowerQuestion.includes("its ") ||
        lowerQuestion.includes("it ") ||
        lowerQuestion.includes("that book") ||
        lowerQuestion.includes("this book") ||
        lowerQuestion.includes("that one") ||
        lowerQuestion.includes("this one")
    ) {

        if (conversationId) {

            const lastReferencedBook =
                await getLastReferencedBook(
                    conversationId
                );

            if (lastReferencedBook) {

                return lastReferencedBook;

            }
        }


        // ---------------------------------------
        // Fallback
        // ---------------------------------------

        return sources[0] || null;
    }


    return null;
};


module.exports = {
    resolveBookReference,
};