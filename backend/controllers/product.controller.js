const Product = require("../models/product.model");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
        });

        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createProduct,
};