const Book = require("../models/Book");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

const embeddings = require("../ai/embeddingModel");

const {
    createBookText,
} = require("../ai/bookText");

const cloudinary = require("../config/cloudinary");


// ======================================================
// GET BOOK BY ID
// ======================================================

const getBookByIdService = async (id) => {

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(
            400,
            "Invalid book ID."
        );
    }

    const book = await Book.findById(id , { isDeleted: false })
        .populate("createdBy", "name email");

    if (!book) {
        throw new ApiError(
            404,
            "Book not found."
        );
    }

    return book;
};

// ======================================================
// ADD BOOK
// ======================================================

const addBookService = async (data, adminId, file) => {
    const {
        title,
        author,
        isbn,
        description,
        category,
        publisher,
        publishedYear,
        language,
        totalCopies,
        location,
    } = data;
    // --------------------------------------------------
    // Check duplicate ISBN
    // --------------------------------------------------

    const existingBook = await Book.findOne({
        isbn,
        isDeleted: false,
    });
    if (existingBook) {
        throw new ApiError(
            409,
            "A book with this ISBN already exists."
        );
    }
    // --------------------------------------------------
    // Prepare book data
    // --------------------------------------------------
    const bookData = {
        title,
        author,
        isbn,
        description,
        category,
        publisher,
        publishedYear,
        language,
        totalCopies,
        availableCopies: totalCopies,
        location,
        createdBy: adminId,
    };
    // --------------------------------------------------
    // Save Cloudinary image information
    // --------------------------------------------------
    if (file) {
        bookData.coverImage = file.path;
        bookData.coverImagePublicId =
            file.filename;
    }

    // --------------------------------------------------
    // Generate embedding text
    // --------------------------------------------------
    const bookText = createBookText(bookData);
    // --------------------------------------------------
    // Generate embedding
    // --------------------------------------------------
    const vector =
        await embeddings.embedQuery(bookText);

    // --------------------------------------------------
    // Add embedding to book
    // --------------------------------------------------
    bookData.embedding = vector;
    // --------------------------------------------------
    // Save book
    // --------------------------------------------------
    const book = await Book.create(bookData);


    return book;
};

// ======================================================
// GET ALL BOOKS
// SEARCH + FILTER + PAGINATION
// ======================================================

const getAllBooksService = async (queryParams) => {

    const {
        search,
        category,
        available,
        page = 1,
        limit = 10,
        sort = "newest",
    } = queryParams;


    // --------------------------------------------------
    // MongoDB query
    // --------------------------------------------------

    const query = {
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } },
        ],
    };


    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    if (
        search &&
        search.trim() !== ""
    ) {

        query.$or = [

            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                author: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                isbn: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];
    }


    // --------------------------------------------------
    // Category filter
    // --------------------------------------------------

    if (
        category &&
        category.trim() !== ""
    ) {

        query.category = {
            $regex: `^${category}$`,
            $options: "i",
        };
    }


    // --------------------------------------------------
    // Availability filter
    // --------------------------------------------------

    if (available === "true") {

        query.availableCopies = {
            $gt: 0,
        };

    } else if (available === "false") {

        query.availableCopies = 0;
    }


    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const pageNumber = Math.max(
        Number(page) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const skip =
        (pageNumber - 1) * limitNumber;


    // --------------------------------------------------
    // Sorting
    // --------------------------------------------------

    let sortOption = {
        createdAt: -1,
    };

    if (sort === "oldest") {

        sortOption = {
            createdAt: 1,
        };

    } else if (sort === "title") {

        sortOption = {
            title: 1,
        };

    } else if (sort === "author") {

        sortOption = {
            author: 1,
        };
    }


    // --------------------------------------------------
    // Get books
    // --------------------------------------------------

    const books = await Book.find(query)
        .populate(
            "createdBy",
            "name email"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);


    // --------------------------------------------------
    // Total books
    // --------------------------------------------------

    const totalBooks =
        await Book.countDocuments(query);


    // --------------------------------------------------
    // Total pages
    // --------------------------------------------------

    const totalPages = Math.ceil(
        totalBooks / limitNumber
    );


    // --------------------------------------------------
    // Return
    // --------------------------------------------------

    return {

        books,

        pagination: {

            page: pageNumber,

            limit: limitNumber,

            totalBooks,

            totalPages,

            hasNextPage:
                pageNumber < totalPages,

            hasPreviousPage:
                pageNumber > 1,
        },
    };
};


// ======================================================
// UPDATE BOOK
// ======================================================

const updateBookService = async (
    id,
    data,
    file
) => {

    // --------------------------------------------------
    // Validate ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid book ID."
        );
    }


    // --------------------------------------------------
    // Find existing book
    // --------------------------------------------------

    const book = await Book.findById(id);

    if (!book) {

        throw new ApiError(
            404,
            "Book not found."
        );
    }


    // --------------------------------------------------
    // If a new image was uploaded
    // --------------------------------------------------

    if (file) {

        // Delete old image from Cloudinary
        if (book.coverImagePublicId) {

            try {

                await cloudinary.uploader.destroy(
                    book.coverImagePublicId
                );

            } catch (error) {

                console.log(
                    "Failed to delete old Cloudinary image:",
                    error.message
                );
            }
        }


        // Save new image
        book.coverImage = file.path;

        book.coverImagePublicId =
            file.filename;
    }


    // --------------------------------------------------
    // Update normal fields
    // --------------------------------------------------

    const allowedFields = [
        "title",
        "author",
        "isbn",
        "description",
        "category",
        "publisher",
        "publishedYear",
        "language",
        "totalCopies",
        "location",
    ];


    for (const field of allowedFields) {

        if (
            data[field] !== undefined
        ) {

            book[field] = data[field];
        }
    }


    // --------------------------------------------------
    // Handle total copies
    // --------------------------------------------------

    if (
        data.totalCopies !== undefined
    ) {

        const newTotalCopies =
            Number(data.totalCopies);

        const borrowedCopies =
            book.totalCopies -
            book.availableCopies;

        if (
            newTotalCopies <
            borrowedCopies
        ) {

            throw new ApiError(
                400,
                "Total copies cannot be less than currently borrowed copies."
            );
        }

        book.totalCopies =
            newTotalCopies;

        book.availableCopies =
            newTotalCopies -
            borrowedCopies;
    }


    // --------------------------------------------------
    // Update availability status
    // --------------------------------------------------

    book.status =
        book.availableCopies > 0
            ? "available"
            : "unavailable";


    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    await book.save();

    return book;
};


// ======================================================
// DELETE BOOK
// ======================================================

const deleteBookService = async (id) => {

    // --------------------------------------------------
    // Validate ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid book ID."
        );
    }


    // --------------------------------------------------
    // Find book
    // --------------------------------------------------

    const book = await Book.findById(id);

    if (!book) {

        throw new ApiError(
            404,
            "Book not found."
        );
    }


    // --------------------------------------------------
    // Delete Cloudinary image
    // --------------------------------------------------

    if (book.coverImagePublicId) {

        try {

            await cloudinary.uploader.destroy(
                book.coverImagePublicId
            );

        } catch (error) {

            console.log(
                "Failed to delete Cloudinary image:",
                error.message
            );
        }
    }


    // --------------------------------------------------
    // Soft delete
    // --------------------------------------------------

    book.isDeleted = true;

    await book.save();


    return {
        message: "Book deleted successfully.",
    };
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getBookByIdService,
    addBookService,
    getAllBooksService,
    updateBookService,
    deleteBookService,
};