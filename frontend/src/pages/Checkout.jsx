
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext.jsx";
import API_URL from "../services/api";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useContext(CartContext);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const existingScript = document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

            if (existingScript) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const verifyPayment = async (paymentResponse, shopKartOrderId) => {
        try {
            const response = await fetch(
                `${API_URL}/orders/verify-payment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        shopKartOrderId,
                        razorpay_order_id: paymentResponse.razorpay_order_id,
                        razorpay_payment_id: paymentResponse.razorpay_payment_id,
                        razorpay_signature: paymentResponse.razorpay_signature,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Payment verification failed"
                );
            }

            setCartItems([]);
            navigate(`/order-success/${shopKartOrderId}`);
        } catch (error) {
            console.error("VERIFY PAYMENT ERROR:", error);
            setServerError(
                error.message || "Payment verification failed"
            );
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) return;

        if (!cartItems || cartItems.length === 0) {
            setServerError("Your cart is empty.");
            return;
        }

        setLoading(true);

        try {
            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                setServerError(
                    "Unable to load Razorpay Checkout. Please try again."
                );
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${API_URL}/orders/create-payment-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        shippingAddress: formData,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to create payment order"
                );
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "ShopKart",
                description: "ShopKart Order",
                order_id: data.razorpayOrderId,

                handler: async function (paymentResponse) {
                    await verifyPayment(
                        paymentResponse,
                        data.shopKartOrderId
                    );
                },

                prefill: {
                    name: formData.fullName,
                    contact: formData.phone,
                },

                theme: {},
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on("payment.failed", function () {
                setServerError(
                    "Payment failed. Your cart has not been cleared. Please try again."
                );
                setLoading(false);
            });

            paymentObject.open();
        } catch (error) {
            console.error("CHECKOUT ERROR:", error);
            setServerError(
                error.message || "Something went wrong during checkout."
            );
            setLoading(false);
        }
    };

    const totalAmount = (cartItems || []).reduce(
        (total, item) =>
            total +
            Number(item.product?.price || 0) *
                Number(item.quantity || 0),
        0
    );

    return (
        <div className="min-h-screen bg-[#ede7dd] text-[#2b2b2b]">
            <Navbar />

            <main className="px-5 py-12 md:py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#8f7d68] mb-3">
                            ShopKart
                        </p>
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Checkout
                        </h1>
                        <p className="mt-3 text-[#6b6258]">
                            Enter your delivery details to continue.
                        </p>
                    </div>

                    {serverError && (
                        <div className="max-w-2xl mx-auto mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                            {serverError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#f8f4ee] rounded-2xl border border-[#d1c7ba] shadow-[0_10px_30px_rgba(70,55,40,0.08)] p-7 md:p-9">
                            <h2 className="text-2xl font-semibold mb-7">
                                Shipping Details
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-[#8f7d68] mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-[#d1c7ba] bg-[#ede7dd] px-4 py-3 outline-none"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8f7d68] mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-[#d1c7ba] bg-[#ede7dd] px-4 py-3 outline-none"
                                        placeholder="10-digit phone number"
                                    />
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8f7d68] mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full rounded-xl border border-[#d1c7ba] bg-[#ede7dd] px-4 py-3 outline-none resize-none"
                                        placeholder="Enter your address"
                                    />
                                    {errors.addressLine1 && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.addressLine1}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm text-[#8f7d68] mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-[#d1c7ba] bg-[#ede7dd] px-4 py-3 outline-none"
                                            placeholder="Enter city"
                                        />
                                        {errors.city && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#8f7d68] mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-[#d1c7ba] bg-[#ede7dd] px-4 py-3 outline-none"
                                            placeholder="Enter state"
                                        />
                                        {errors.state && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8f7d68] mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-[#d1c7ba] bg-[#ede7dd] px-4 py-3 outline-none"
                                        placeholder="6-digit pincode"
                                    />
                                    {errors.pincode && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.pincode}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#2b2b2b] px-6 py-3.5 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </form>
                        </div>

                        <div className="h-fit bg-[#f8f4ee] rounded-2xl border border-[#d1c7ba] p-6">
                            <h2 className="text-xl font-semibold mb-5">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                {cartItems?.map((item) => (
                                    <div
                                        key={item.product?._id}
                                        className="flex justify-between gap-3 border-b border-[#ded5ca] pb-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-[#6b6258]">
                                                × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-medium">
                                            ₹
                                            {(
                                                Number(item.product?.price || 0) *
                                                Number(item.quantity || 0)
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                ))}

                                <div className="flex justify-between pt-2 text-lg font-semibold">
                                    <span>Total</span>
                                    <span>
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
