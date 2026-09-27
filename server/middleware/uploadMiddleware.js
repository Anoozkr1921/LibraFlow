const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "libraflow/books",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const uploadWithErrors = (req, res, next) => {
    upload.single("coverImage")(req, res, (error) => {
        if (!error) return next();

        console.error("Cover upload error:", {
            message: error.message,
            name: error.name,
            code: error.code,
            error: error.error,
            stack: error.stack,
        });
        return next(error);
    });
};

module.exports = upload;
module.exports.withErrors = uploadWithErrors;