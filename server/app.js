const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const chatRoutes = require("./routes/chatRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();
const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://libra-flow-1.vercel.app",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin === "http://localhost:5173") {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Library API Running 🚀",
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.http_code || 500;
    const message = err.code === "LIMIT_FILE_SIZE"
        ? "Cover image is too large. Please upload an image under 5 MB."
        : err.name === "MulterError"
            ? `Cover image upload failed: ${err.message}`
            : err.message || err.error?.message || err.error?.error?.message || err.toString?.() || "Internal Server Error";

    console.error("API error:", {
        method: req.method,
        path: req.originalUrl,
        statusCode,
        message,
        name: err.name,
        code: err.code,
        providerError: err.error,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        message,
        stack:
            process.env.NODE_ENV === "production"
                ? null
                : err.stack,
    });
});

module.exports = app;