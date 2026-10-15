import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/Searchbar";
import Navbar from "../components/Navbar";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlist, setWishlist] = useState([]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            let url = "http://localhost:6010/products";

            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            if (category) {
                params.append("category", category);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            setProducts(data.products);
        } catch (error) {
            setError("Something went wrong while loading products.");
        } finally {
            setLoading(false);
        }
    };
const fetchWishlist = async () => {
    try {
        const response = await fetch("http://localhost:6010/wishlist", {
            credentials: "include",
        });

        const data = await response.json();

        console.log("WISHLIST RESPONSE:", data);

        if (!response.ok) return;

        setWishlist(data.wishlist || []);
    } catch (error) {
        console.log("FAILED TO FETCH WISHLIST:", error);
    }
};

    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, [search, category]);

    return (
        <div className="min-h-screen">

            <Navbar />

            <div className="products-page">

                <div className="products-header">
                    <h1>ShopKart Products</h1>

                    <p>
                        Discover products you'll love.
                    </p>
                </div>

                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                />

                {loading && (
                    <p className="products-message">
                        Loading products...
                    </p>
                )}

                {error && (
                    <p className="products-message error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="products-message">
                        No products found.
                    </p>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                isWishlisted={wishlist.some(
                                    item => item._id?.toString() === product._id?.toString()
                                )}
                            />
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
};

export default Products;