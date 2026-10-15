const express = require("express");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
} = require("../controllers/cart.controller");

const authMiddleware = require("../middlewares/auth.middlewares");

const router = express.Router();

router.post("/:productId", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.patch("/:productId", authMiddleware, updateCartQuantity);
router.delete("/:productId", authMiddleware, removeFromCart);

module.exports = router;