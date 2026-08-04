const { body } = require("express-validator");

exports.borrowBookValidator = [
    body("bookId")
        .notEmpty()
        .withMessage("Book ID is required"),
];