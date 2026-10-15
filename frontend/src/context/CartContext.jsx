
import { createContext, useEffect, useState } from "react";
import API_URL from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get cart from backend
    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/cart`, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch cart");
            }

            setCartItems(
                (data.cart || []).filter(
                    (item) => item.product && item.product._id
                )
            );
        } catch (error) {
            console.log("FETCH CART ERROR:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add product to cart
    const addToCart = async (productId) => {
        try {
            setError("");

            const response = await fetch(`${API_URL}/cart/${productId}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add product to cart"
                );
            }

            await fetchCart();
        } catch (error) {
            console.log("ADD TO CART ERROR:", error);
            setError(error.message);
            throw error;
        }
    };

    // Update quantity
    const updateCartQuantity = async (productId, quantity) => {
        try {
            setError("");

            const response = await fetch(`${API_URL}/cart/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update cart quantity"
                );
            }

            await fetchCart();
        } catch (error) {
            console.log("UPDATE CART ERROR:", error);
            setError(error.message);
            throw error;
        }
    };

    // Remove product from cart
    const removeFromCart = async (productId) => {
        try {
            setError("");

            const response = await fetch(`${API_URL}/cart/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to remove product"
                );
            }

            await fetchCart();
        } catch (error) {
            console.log("REMOVE CART ERROR:", error);
            setError(error.message);
            throw error;
        }
    };

    // Fetch cart when app starts
    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                loading,
                setLoading,
                error,
                setError,
                fetchCart,
                addToCart,
                updateCartQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
