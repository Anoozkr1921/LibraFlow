const parseStructuredQuery = (question) => {
    const q = question.trim();
    const result = {
        title: null,
        author: null,
        category: null,
        isbn: null,
    };

    const isbnMatch = q.match(
        /\b(?:isbn[\s:-]*)?(\d{10}|\d{13})\b/i
    );

    if (isbnMatch) {
        result.isbn = isbnMatch[1];
    }

    const authorMatch = q.match(
        /(?:written\s+by|books?\s+by|author(?:\s+is)?)[\s:]+(.+?)(?:\?|$)/i
    );

    if (authorMatch) {
        result.author = authorMatch[1].trim();
    }

    const categoryMatch = q.match(
        /(?:category|genre)[\s:]+(.+?)(?:\?|$)/i
    );

    if (categoryMatch) {
        result.category = categoryMatch[1].trim();
    }
    return result;
};

module.exports = {
    parseStructuredQuery,
};