
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API_URL from "../services/api";

const ProductCard = ({ product, isWishlisted }) => {
    const navigate = useNavigate();

    const { addToCart, cartItems } = useContext(CartContext);

    const [wishlistStatus, setWishlistStatus] = useState("idle");
    const [cartStatus, setCartStatus] = useState("idle");

    // Sync Wishlist and Cart status with global state
    useEffect(() => {
        if (isWishlisted) {
            setWishlistStatus("success");
        } else {
            setWishlistStatus("idle");
        }

        const alreadyInCart = cartItems.some(
            (item) =>
                item.product?._id?.toString() ===
                product._id?.toString()
        );

        if (alreadyInCart) {
            setCartStatus("success");
        } else {
            setCartStatus("idle");
        }
    }, [isWishlisted, cartItems, product._id]);

    // Add product to wishlist
    const addToWishlist = async () => {
        if (wishlistStatus === "saving") return;

        setWishlistStatus("saving");

        try {
            const response = await fetch(
                `${API_URL}/wishlist/${product._id}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (response.ok || response.status === 409) {
                setWishlistStatus("success");
            } else {
                console.log(data.message);
                setWishlistStatus("error");
            }
        } catch (error) {
            console.log(error);
            setWishlistStatus("error");
        }
    };

    // Add product to cart
    const handleAddToCart = async () => {
        if (cartStatus === "saving") return;

        setCartStatus("saving");

        try {
            await addToCart(product._id);
            setCartStatus("success");
        } catch (error) {
            console.log(error);
            setCartStatus("error");
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.image}
                alt={product.name}
                className={
                    product.category === "Books"
                        ? "book-image"
                        : "product-image"
                }
            />

            <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.category}</p>
                <h3>₹{product.price}</h3>

                <p>
                    {product.stock > 0
                        ? `${product.stock} units left`
                        : "Out of stock"}
                </p>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={
                        product.stock === 0 ||
                        cartStatus === "saving"
                    }
                >
                    {cartStatus === "saving"
                        ? "Adding..."
                        : cartStatus === "success"
                            ? "✓ Added to Cart"
                            : cartStatus === "error"
                                ? "Try Again"
                                : "Add to Cart"}
                </button>

                {/* Wishlist */}
                <button
                    onClick={addToWishlist}
                    disabled={
                        wishlistStatus === "saving" ||
                        wishlistStatus === "success"
                    }
                >
                    {wishlistStatus === "saving"
                        ? "Saving..."
                        : wishlistStatus === "success"
                            ? "♥ Added"
                            : wishlistStatus === "error"
                                ? "♡ Try Again"
                                : "♡ Wishlist"}
                </button>

                {/* View Details */}
                <button
                    onClick={() =>
                        navigate(`/products/${product._id}`)
                    }
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
