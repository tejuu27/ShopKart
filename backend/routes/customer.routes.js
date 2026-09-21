const express = require("express")
const router = express.Router()

const { registerCustomer, loginCustomer, getMyProfile, logoutCustomer } = require("../controllers/customer.controller.js")

const authMiddleware = require("../middlewares/auth.middlewares.js");
router.post("/register", registerCustomer)
router.post("/login", loginCustomer)
router.get("/me", authMiddleware, getMyProfile)
router.post("/logout", logoutCustomer )

module.exports = router