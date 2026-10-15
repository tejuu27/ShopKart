import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {CartContext} from "../context/CartContext";

const Cart = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        loading,
        error,
        fetchCart,
        updateCartQuantity,
        removeFromCart,
    } = useContext(CartContext);

    const [actionProductId, setActionProductId] = useState(null);

    // Total number of products/units
    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Calculate subtotal
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    // Increase quantity
    const handleIncrease = async (item) => {
        if (item.quantity >= item.product.stock) {
            return;
        }

        setActionProductId(item.product._id);

        try {
            await updateCartQuantity(
                item.product._id,
                item.quantity + 1
            );
        } catch (error) {
            console.log(error);
        } finally {
            setActionProductId(null);
        }
    };

    // Decrease quantity
    const handleDecrease = async (item) => {
        if (item.quantity <= 1) {
            return;
        }

        setActionProductId(item.product._id);

        try {
            await updateCartQuantity(
                item.product._id,
                item.quantity - 1
            );
        } catch (error) {
            console.log(error);
        } finally {
            setActionProductId(null);
        }
    };

    // Remove product
    const handleRemove = async (productId) => {
        setActionProductId(productId);

        try {
            await removeFromCart(productId);
        } catch (error) {
            console.log(error);
        } finally {
            setActionProductId(null);
        }
    };

    // Loading
    if (loading) {
        return (
            <main className="products-page">
                <div className="products-message">
                    Loading your cart...
                </div>
            </main>
        );
    }

    // Error
    if (error) {
        return (
            <main className="products-page">
                <div className="products-message">
                    <h2>Unable to load your cart.</h2>

                    <p>{error}</p>

                    <button onClick={fetchCart}>
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <main className="products-page">

                <div className="products-header">
                    <h1>My Cart</h1>
                    <p>Your cart is currently empty.</p>
                </div>

                <div className="products-message">

                    <p>Your cart is empty 🛒</p>

                    <p>
                        Looks like you haven't added anything yet.
                    </p>

                    <button
                        className="browse-products-button"
                        onClick={() => navigate("/products")}
                    >
                        Browse Products
                    </button>

                </div>

            </main>
        );
    }

    return (
        <main className="products-page">

            {/* Header */}
            <div className="products-header">
                <h1>My Cart</h1>
                <p>Your selected products</p>
            </div>

            {/* Cart Layout */}
            <div className="cart-layout">

                {/* Cart Products */}
                <div className="cart-products">

                    {cartItems.map((item) => {

                        const isUpdating =
                            actionProductId === item.product._id;

                        return (
                            <div
                                className="product-card"
                                key={item.product._id}
                            >

                                {/* Product Image */}
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="product-image"
                                />

                                <div className="product-info">

                                    <h2>
                                        {item.product.name}
                                    </h2>

                                    <p>
                                        {item.product.category}
                                    </p>

                                    <h3>
                                        ₹{item.product.price}
                                    </h3>

                                    <p>
                                        Stock: {item.product.stock}
                                    </p>

                                    {/* Quantity */}
                                    <div className="quantity-controls">

                                        <button
                                            className="quantity-button"
                                            onClick={() =>
                                                handleDecrease(item)
                                            }
                                            disabled={
                                                item.quantity <= 1 ||
                                                isUpdating
                                            }
                                        >
                                            −
                                        </button>

                                        <span className="quantity-number">
                                            {item.quantity}
                                        </span>

                                        <button
                                            className="quantity-button"
                                            onClick={() =>
                                                handleIncrease(item)
                                            }
                                            disabled={
                                                item.quantity >=
                                                    item.product.stock ||
                                                isUpdating
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() =>
                                            handleRemove(
                                                item.product._id
                                            )
                                        }
                                        disabled={isUpdating}
                                    >
                                        {isUpdating
                                            ? "Updating..."
                                            : "Remove"}
                                    </button>

                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Order Summary */}
                <aside className="cart-summary">

                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Total Items</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <hr />

                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <button
                        className="checkout-button"
                        onClick={() =>
                            navigate("/checkout")
                        }
                    >
                        Proceed to Checkout
                    </button>

                </aside>

            </div>

        </main>
    );
};

export default Cart;