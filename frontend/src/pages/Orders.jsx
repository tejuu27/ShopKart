import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Orders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    "http://localhost:6010/orders",
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch orders"
                    );
                }

                setOrders(data.orders || []);
            } catch (error) {
                console.log("FETCH ORDERS ERROR:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ede7dd] flex items-center justify-center">
                <p className="text-[#6b6258] text-lg">
                    Loading orders...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ede7dd] text-[#2b2b2b]">
            <Navbar />

            <main className="px-5 py-12 md:py-16">
                <div className="max-w-5xl mx-auto">

                    <div className="text-center mb-10">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#8f7d68] mb-3">
                            ShopKart
                        </p>

                        <h1 className="text-4xl md:text-5xl font-semibold">
                            My Orders
                        </h1>

                        <p className="mt-3 text-[#6b6258]">
                            View your order history and order details.
                        </p>
                    </div>

                    {error && (
                        <div className="max-w-2xl mx-auto mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                            {error}
                        </div>
                    )}

                    {!error && orders.length === 0 && (
                        <div className="max-w-xl mx-auto bg-[#f8f4ee] border border-[#d1c7ba] rounded-2xl p-10 text-center">
                            <h2 className="text-2xl font-semibold">
                                No orders yet
                            </h2>

                            <p className="mt-3 text-[#6b6258]">
                                You haven't placed any orders yet.
                            </p>

                            <button
                                onClick={() => navigate("/products")}
                                className="mt-6 px-6 py-3 rounded-xl bg-[#2b2b2b] text-white font-medium hover:opacity-90"
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}

                    <div className="space-y-5">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-[#f8f4ee] border border-[#d1c7ba] rounded-2xl p-6 shadow-[0_10px_30px_rgba(70,55,40,0.06)]"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>
                                        <p className="text-sm text-[#8f7d68]">
                                            Order ID
                                        </p>

                                        <p className="font-medium break-all">
                                            {order._id}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="px-3 py-1 rounded-full bg-[#ede7dd] text-sm font-medium">
                                            {order.status}
                                        </span>

                                        <span className="px-3 py-1 rounded-full bg-[#ede7dd] text-sm font-medium">
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-[#ded5ca] pt-5">

                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex justify-between gap-4"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-sm text-[#6b6258]">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="font-medium">
                                                    ₹
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center mt-5 pt-5 border-t border-[#ded5ca]">
                                        <div>
                                            <p className="text-sm text-[#8f7d68]">
                                                Order Date
                                            </p>

                                            <p className="font-medium">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-[#8f7d68]">
                                                Total
                                            </p>

                                            <p className="text-xl font-semibold">
                                                ₹
                                                {order.totalAmount.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/order-success/${order._id}`
                                            )
                                        }
                                        className="mt-5 w-full px-5 py-3 rounded-xl bg-[#2b2b2b] text-white font-medium hover:opacity-90 transition"
                                    >
                                        View Order
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Orders;