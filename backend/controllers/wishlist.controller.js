const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const customer = req.user;
        if (customer.wishlist.includes(product._id)) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist",
            });
        }
        customer.wishlist.push(product._id);
        await customer.save();
        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist",
        });
    }
};

const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate("wishlist");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist,
        });

    } catch (error) {
        console.log("GET WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist",
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const customer = req.user;

        const wishlistItem = customer.wishlist.find(
            (id) => id.toString() === productId
        );

        if (!wishlistItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in wishlist",
            });
        }

        customer.wishlist = customer.wishlist.filter(
            (id) => id.toString() !== productId
        );

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to remove product from wishlist",
        });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
}