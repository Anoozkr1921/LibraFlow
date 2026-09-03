const createBookText = (book) => {
    return `
Title: ${book.title}
Author: ${book.author}
Category: ${book.category}
Description: ${book.description || ""}
Publisher: ${book.publisher || ""}
Published Year: ${book.publishedYear || ""}
Language: ${book.language || ""}
Location: ${book.location || ""}
`;
};

module.exports = {
    createBookText,
};