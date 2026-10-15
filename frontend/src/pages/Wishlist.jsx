
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../services/api";

const Wishlist = () => {
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/wishlist`, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch wishlist");
            }

            setWishlist(data.wishlist);
        } catch (error) {
            console.log(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            const response = await fetch(
                `${API_URL}/wishlist/${productId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to remove product"
                );
            }

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (product) => product._id !== productId
                )
            );
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <main className="products-page">
                <div className="products-message">
                    Loading wishlist...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="products-page">
                <div className="products-message error-message">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchWishlist}>Retry</button>
                </div>
            </main>
        );
    }

    if (wishlist.length === 0) {
        return (
            <main className="products-page">
                <div className="products-header">
                    <h1>My Wishlist</h1>
                    <p>Your wishlist is currently empty.</p>
                </div>

                <div className="products-message">
                    <button
                        className="continue-shopping-button"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="products-page">
            <div className="products-header">
                <h1>My Wishlist</h1>
                <p>Your saved products</p>
            </div>

            <div className="products-grid">
                {wishlist.map((product) => (
                    <div className="product-card" key={product._id}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
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

                            <button
                                onClick={() =>
                                    navigate(`/products/${product._id}`)
                                }
                            >
                                View Details
                            </button>

                            <button
                                onClick={() =>
                                    removeFromWishlist(product._id)
                                }
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Wishlist;
