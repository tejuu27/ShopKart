import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(
                    `http://localhost:6010/orders/${id}`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch order"
                    );
                }

                setOrder(data.order);
            } catch (error) {
                console.log("FETCH ORDER ERROR:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ede7dd] flex items-center justify-center">
                <p className="text-[#6b6258] text-lg">
                    Loading order...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#ede7dd]">
                <Navbar />

                <div className="min-h-[80vh] flex items-center justify-center px-5">
                    <div className="bg-[#f8f4ee] border border-[#d1c7ba] rounded-2xl p-8 text-center max-w-md">
                        <h1 className="text-2xl font-semibold text-red-600">
                            Something went wrong
                        </h1>

                        <p className="mt-3 text-[#6b6258]">
                            {error}
                        </p>

                        <button
                            onClick={() => navigate("/orders")}
                            className="mt-6 px-6 py-3 rounded-xl bg-[#2b2b2b] text-white font-medium hover:opacity-90"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ede7dd] text-[#2b2b2b]">
            <Navbar />

            <main className="px-5 py-12 md:py-20">
                <div className="max-w-3xl mx-auto">

                    {/* Success Header */}
                    <div className="text-center mb-10">

                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                            ✓
                        </div>

                        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#8f7d68]">
                            ShopKart
                        </p>

                        <h1 className="text-4xl md:text-5xl font-semibold mt-2">
                            Order Confirmed
                        </h1>

                        <p className="mt-4 text-[#6b6258] text-lg">
                            Thank you for your purchase!
                        </p>

                        <p className="mt-2 text-sm text-[#8f7d68]">
                            Order ID: {order?._id}
                        </p>
                    </div>

                    {/* Order Card */}
                    <div className="bg-[#f8f4ee] rounded-2xl border border-[#d1c7ba] shadow-[0_10px_30px_rgba(70,55,40,0.08)] p-6 md:p-8">

                        <h2 className="text-2xl font-semibold mb-6">
                            Order Details
                        </h2>

                        {/* Products */}
                        <div className="space-y-5">

                            {order?.items?.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 border-b border-[#ded5ca] pb-5"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-xl bg-white"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-semibold">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm text-[#6b6258] mt-1">
                                            ₹{item.price} × {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-semibold">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}

                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mt-7 pt-5 border-t border-[#d1c7ba]">
                            <span className="text-lg font-semibold">
                                Total
                            </span>

                            <span className="text-2xl font-semibold">
                                ₹{order?.totalAmount}
                            </span>
                        </div>

                        {/* Payment Status */}
                        <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200">
                            <p className="text-sm text-green-700">
                                Payment Status
                            </p>

                            <p className="font-semibold text-green-800 mt-1">
                                {order?.paymentStatus}
                            </p>
                        </div>

                        {/* Shipping */}
                        <div className="mt-7">
                            <h2 className="text-xl font-semibold mb-4">
                                Shipping Address
                            </h2>

                            <div className="text-[#6b6258] leading-7">
                                <p className="font-medium text-[#2b2b2b]">
                                    {order?.shippingAddress?.fullName}
                                </p>

                                <p>
                                    {order?.shippingAddress?.addressLine1}
                                </p>

                                <p>
                                    {order?.shippingAddress?.city},{" "}
                                    {order?.shippingAddress?.state}
                                </p>

                                <p>
                                    PIN: {order?.shippingAddress?.pincode}
                                </p>

                                <p>
                                    Phone: {order?.shippingAddress?.phone}
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-8">

                            <button
                                onClick={() => navigate("/orders")}
                                className="flex-1 px-6 py-3 rounded-xl bg-[#2b2b2b] text-white font-medium hover:opacity-90 transition"
                            >
                                View My Orders
                            </button>

                            <button
                                onClick={() => navigate("/products")}
                                className="flex-1 px-6 py-3 rounded-xl border border-[#cfc4b6] bg-white font-medium hover:bg-[#f1ebe3] transition"
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default OrderSuccess;