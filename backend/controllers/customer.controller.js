const bcrypt = require("bcrypt")
const Customer = require("../models/customer.model.js")
const generateToken = require("../utils/generateToken.js")

const registerCustomer = async (req, res) => {
    const { fullName, email, password, phone } = req.body
    if (!fullName || !email || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must contain atleast 6 characters'
        })
    }

    const existingCustomer = await Customer.findOne({ email })

    if (existingCustomer) {
        return res.status(409).json({
            success: false,
            message: 'Email already exists',
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    // 10 is the salt rounds or cost factor iIt controls the computational work required to 
    // generate the password hash. A higher value makes hashing more expensive and harder to
    //  brute-force, but also takes more processing time.

    const customer = await Customer.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
    })

    return res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        customer: {
            _id: customer._id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
        }
    })
}


const loginCustomer = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        })
    }

    const customer = await Customer.findOne({ email })
    if (!customer) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, customer.password)
    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        })
    }
    const token = generateToken(customer._id)

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
        success: true,
        message: "Login successful",
        customer: {
            _id: customer._id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
        },
    });
}

const getMyProfile = async (req, res) => {
    return res.status(200).json({
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
    })
}

const logoutCustomer = (req, res) => {
    res.clearCookie("token")

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    })
}
module.exports = { registerCustomer, loginCustomer, getMyProfile, logoutCustomer }