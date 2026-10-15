const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
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

        
        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        
        const newQuantity = cartItem
            ? cartItem.quantity + 1
            : 1;

       
        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available stock",
            });
        }

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            customer.cart.push({
                product: product._id,
                quantity: 1,
            });
        }

        
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart,
        });

    } catch (error) {
        console.log("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
        });
    }
};

const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate("cart.product");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            success: true,
            cart: customer.cart,
        });

    } catch (error) {
        console.log("GET CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

       
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a number greater than or equal to 1",
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

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart",
            });
        }


        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available stock",
            });
        }


        cartItem.quantity = quantity;

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: customer.cart,
        });

    } catch (error) {
        console.log("UPDATE CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update cart quantity",
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

       
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

     
        const customer = req.user;

       
        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart",
            });
        }

       
        customer.cart = customer.cart.filter(
            (item) => item.product.toString() !== productId
        );

     
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart,
        });

    } catch (error) {
        console.log("REMOVE FROM CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart",
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
};