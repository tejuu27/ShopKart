const mongoose = require("mongoose");
const crypto = require("crypto");

const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const razorpay = require("../config/razorpay");


const createPaymentOrder = async (req, res) => {
    try {
        const customer = req.user;
        const { shippingAddress } = req.body;


        if (
            !shippingAddress ||
            !shippingAddress.fullName?.trim() ||
            !shippingAddress.phone?.trim() ||
            !shippingAddress.addressLine1?.trim() ||
            !shippingAddress.city?.trim() ||
            !shippingAddress.state?.trim() ||
            !shippingAddress.pincode?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All shipping address fields are required",
            });
        }

        const phone = shippingAddress.phone.trim();
        const pincode = shippingAddress.pincode.trim();

    
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number",
            });
        }

    
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pincode",
            });
        }

      
        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

       
        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product);

           
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }


            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

          
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image,
            });

         
            totalAmount += product.price * cartItem.quantity;
        }

        const order = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phone,
                addressLine1: shippingAddress.addressLine1.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                pincode,
            },
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT",
        });

        // 5. Create Razorpay order
        try {
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: order._id.toString(),
            });

            // 6. Save Razorpay order ID
            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            // 7. Send checkout information to frontend
            return res.status(201).json({
                success: true,
                shopKartOrderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID,
            });
        } catch (razorpayError) {
            console.log(
                "RAZORPAY ORDER ERROR:",
                razorpayError.message
            );

            // ShopKart order already exists.
            // Keep it as PENDING_PAYMENT.
            return res.status(503).json({
                success: false,
                message: "Razorpay test credentials are not configured",
                shopKartOrderId: order._id,
            });
        }
    } catch (error) {
        console.log("CREATE PAYMENT ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment order",
        });
    }
};

// ======================================================
// VERIFY PAYMENT
// ======================================================

const verifyPayment = async (req, res) => {
    try {
        const customer = req.user;

        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // 1. Validate payment details
        if (
            !shopKartOrderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are required",
            });
        }

        // 2. Find ShopKart order using MongoDB order ID
        const order = await Order.findById(shopKartOrderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 3. Check order ownership
        if (
            order.user.toString() !== customer._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to verify this order",
            });
        }

        // 4. Check Razorpay order ID
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order ID",
            });
        }

        // 5. Generate signature on backend
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // 6. Compare signatures
        if (generatedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED";

            await order.save();

            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // 7. Payment is verified
        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        // 8. Clear cart ONLY after successful verification
        customer.cart = [];

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified and order placed",
            order,
        });
    } catch (error) {
        console.log("VERIFY PAYMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify payment",
        });
    }
};

// ======================================================
// GET ALL ORDERS
// ======================================================

const getOrders = async (req, res) => {
    try {
        const customer = req.user;

        const orders = await Order.find({
            user: customer._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log("GET ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};

// ======================================================
// GET ORDER BY ID
// ======================================================

const getOrderById = async (req, res) => {
    try {
        const customer = req.user;
        const { id } = req.params;

        // 1. Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        // 2. Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 3. Check ownership
        if (
            order.user.toString() !== customer._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this order",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.log("GET ORDER BY ID ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById,
};