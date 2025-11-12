import React, { useState, useEffect } from "react";
import "./InventoryPage.css";
import { lendBooks } from "./InventoryAPI";
import axios from "axios";

const InventoryPage = () => {

    const [cartItems, setCartItems] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);

    const [selectedBooks, setSelectedBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [lendQuantities, setLendQuantities] = useState({});


    useEffect(() => {
        const saved = JSON.parse(sessionStorage.getItem("cart")) || [];
        setCartItems(saved);
    }, []);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleSelect = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleLend = () => {
        const lendBooks = cartItems.filter((item) => selectedItems.includes(item.id));
        if (lendBooks.length === 0) return alert("Please select at least one book!");

        setShowModal(true);
    };

    const removeItem = (id) => {
        const updated = cartItems.filter((b) => b.id !== id);
        setCartItems(updated);
        sessionStorage.setItem("cart", JSON.stringify(updated));
    };

    const handleQuantityChange = (id, value) => {
        const book = cartItems.find((b) => b.id === id);
        const qty = parseInt(value) || 0;

        if (qty > book.detailedInformation?.stockCount) {
            alert(`❌ Only ${book.detailedInformation.stockCount} copies available for "${book.title}"`);
            return;
        }

        setLendQuantities((prev) => ({ ...prev, [id]: qty }));
    };

    const confirmLend = async () => {

        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ You must be logged in!");
            return;
        }

        const lendBook = selectedItems.map((id) => {
            const book = cartItems.find((b) => b.id === id);
            return {
                id: book.id,
                title: book.title,
                isbn: book.isbn,
                description: book.description,
                author: book.author,
                language: book.language,
                qty: lendQuantities[id] || 1,
                detailedInformation: {
                    dateAdded: book.detailedInformation?.dateAdded,
                    available: book.detailedInformation?.available,
                    damage: book.detailedInformation?.damage,
                    stockCount: book.detailedInformation?.stockCount,
                    price: book.detailedInformation?.price
                }
            };
        });

        try {
            const res = await lendBooks(lendBook);
            console.log("Lend API Response:", res);

            alert("✅ Lend successful!");
            setShowModal(false);

            // Remove selected books from cart
            const remaining = cartItems.filter((b) => !selectedItems.includes(b.id));
            setCartItems(remaining);
            sessionStorage.setItem("cart", JSON.stringify(remaining));
            setSelectedItems([]);
            setLendQuantities({});

        } catch (error) {
            console.error("Lend failed:", error);
            alert("❌ Failed to lend books. Please try again.");

        }
    };

    return (
        <div className="cart-container">
            <h1 className="cart-title">🛒 Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="empty-text">Your cart is empty.</p>
            ) : (
                <div className="cart-list">
                    {cartItems.map((book) => (
                        <div key={book.id} className="cart-card">
                            <div className="cart-header">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(book.id)}
                                    onChange={() => toggleSelect(book.id)}
                                />
                                <h2>{book.title}</h2>
                                <button onClick={() => removeItem(book.id)} className="remove-btn">
                                    ❌
                                </button>
                            </div>

                            <p className="cart-author">
                                <strong>Author:</strong> {book.author}
                            </p>
                            <p><strong>Renewal Fee:</strong> ₹{book.detailedInformation?.price}</p>

                            <div className="cart-actions">
                                <button onClick={() => toggleExpand(book.id)} className="expand-btn">
                                    {expanded[book.id] ? "Hide Details ▲" : "View Details ▼"}
                                </button>
                            </div>

                            {expanded[book.id] && (
                                <div className="cart-details">
                                    <p><strong>ISBN:</strong> {book.isbn}</p>
                                    <p><strong>Language:</strong> {book.language}</p>
                                    <p><strong>Description:</strong> {book.description}</p>
                                    <p><strong>Stock:</strong> {book.detailedInformation?.stockCount}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <button onClick={handleLend} className="lend-btn">
                        📚 Proceed to Lend ({selectedItems.length})
                    </button>
                </div>
            )}
            {/* Quantity Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>📦 Confirm Quantities</h3>
                        {selectedItems.map((id) => {
                            const book = cartItems.find((b) => b.id === id);
                            return (
                                <div key={id} className="quantity-row">
                                    <span>{book.title}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={book.detailedInformation?.stockCount}
                                        placeholder="Qty"
                                        value={lendQuantities[id] || ""}
                                        onChange={(e) => handleQuantityChange(id, e.target.value)}
                                    />
                                    <span className="stock-info">
                                        Stock: {book.detailedInformation?.stockCount}
                                    </span>
                                </div>
                            );
                        })}
                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={confirmLend}>✅ Confirm</button>
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>❌ Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}
export default InventoryPage;
