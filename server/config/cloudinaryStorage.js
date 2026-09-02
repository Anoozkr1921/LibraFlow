const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "libraflow/books",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ],

        transformation: [
            {
                width: 800,
                height: 1000,
                crop: "limit",
            },
        ],
    },
});

module.exports = storage;