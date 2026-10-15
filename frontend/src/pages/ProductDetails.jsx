import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:6010/products/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }

                const data = await response.json();

                setProduct(data);
            } catch (error) {
                setError("Something went wrong while loading the product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />

                <div className="product-details-message">
                    Loading product...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <Navbar />

                <div className="product-details-message error-message">
                    {error}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen">
                <Navbar />

                <div className="product-details-message">
                    Product not found.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">

            <Navbar />

            <div className="product-details-page">

                <div className="product-details-card">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-details-image"
                    />

                    <div className="product-details-info">

                        <p className="product-details-category">
                            {product.category}
                        </p>

                        <h1>{product.name}</h1>

                        <p className="product-details-description">
                            {product.description}
                        </p>

                        <h2>₹{product.price}</h2>

                        <p>
                            {product.stock > 0
                                ? `${product.stock} units available`
                                : "Out of stock"}
                        </p>

                        <button className="add-to-cart-button">
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;