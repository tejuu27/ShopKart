const express = require("express");
const { createProduct, getAllProducts, getSingleProduct, getStock } = require("../controllers/product.controller");

const router = express.Router();

router.post("/", createProduct);

router.get("/", getAllProducts)

router.get("/:id", getSingleProduct)

router.get("/:id/:stock", getStock);

module.exports = router;