require("dotenv").config();

const mongoose = require("mongoose");
const Book = require("../models/Book");
const embeddings = require("./embeddingModel");

const {
    createBookText,
} = require("./bookText");

const generateBookEmbeddings = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(
            process.env.MONGO_URI
        );
        console.log("MongoDB connected");

        // Get all books
        const books = await Book.find({
            $or: [
                { isDeleted: false },
                { isDeleted: { $exists: false } },
            ],
        });
        console.log(
            `Found ${books.length} books`
        );
        // Generate embedding for each book
        for (const book of books) {
            console.log(
                `Generating embedding for: ${book.title}`
            );
            // Create text representation
            const text = createBookText(book);
            // Generate vector
            const vector =
                await embeddings.embedQuery(text);

            // Save vector
            book.embedding = vector;
            await book.save();

            console.log(
                `Embedding saved for: ${book.title}`
            );
        }
        console.log(
            "All book embeddings generated successfully."
        );
        process.exit(0);
    } catch (error) {
        console.error(
            "Error generating embeddings:",
            error
        );
        process.exit(1);
    }
};

generateBookEmbeddings();