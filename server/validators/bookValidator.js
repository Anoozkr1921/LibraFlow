const { body } = require("express-validator");

exports.addBookValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author is required"),

    body("isbn")
        .trim()
        .notEmpty()
        .withMessage("ISBN is required"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("totalCopies")
        .isInt({ min: 1 })
        .withMessage("Total copies must be at least 1"),
];