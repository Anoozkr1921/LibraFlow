const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

router.get(
    "/",
    verifyJWT,
    isAdmin,
    getAllUsers
);

router.get(
    "/:id",
    verifyJWT,
    isAdmin,
    getUserById
);

router.put(
    "/:id",
    verifyJWT,
    isAdmin,
    updateUser
);

router.delete(
    "/:id",
    verifyJWT,
    isAdmin,
    deleteUser
);


module.exports = router;