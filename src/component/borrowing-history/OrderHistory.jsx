import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [accountId, setAccountId] = useState("")

    const fetchAccountDetails = () => {
        const token = localStorage.getItem("token");

        axios.get("http://192.168.1.4:8080/v1/account-management/findById", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                setOrders(res.data.orders);
                setAccountId(res.data.id)
            })
            .catch(e => console.log(e));
    }

    useEffect(() => fetchAccountDetails(), []);

    const handleReturnBook = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete("http://192.168.1.4:8080/v1/inventory/return",
                {
                    params: {
                        accountId: accountId,
                        orderId, orderId

                    },
                     headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );
            alert("Book returned successfully!");

            // Update orders locally
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, due: true }
                        : order
                )
            );
        } catch (error) {
            console.error("Error returning book:", error);
            alert("Failed to return book.");
        }
    };

    return (
        <div className="order-container">
            <h1 className="order-title">📖 Your Borrowed Books</h1>

            {orders.length === 0 ? (
                <p className="no-history">No borrowed history found.</p>
            ) : (
                <div className="order-grid">
                    {orders.map((order) =>
                        order.book.map((book) => (
                            <div key={book.id} className="order-card">
                                <div className="order-card-header">
                                    <h2 className="order-book-title">{book.title}</h2>
                                    <span className="order-author">{book.author}</span>
                                </div>

                                <div className="order-info-row">
                                    <strong>ISBN:</strong> <span>{book.isbn}</span>
                                </div>
                                <div className="order-info-row">
                                    <strong>Language:</strong> <span>{book.language}</span>
                                </div>
                                <div className="order-info-row">
                                    <strong>Order Date:</strong> <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div className="order-info-row">
                                    <strong>Return Date:</strong> <span>{new Date(order.returnDate).toLocaleDateString()}</span>
                                </div>
                                <div className="order-info-row">
                                    <strong>Status:</strong>
                                    {new Date(order.returnDate) < new Date() ? (
                                        <span className="badge badge-due">Due</span>
                                    ) : (
                                        <span className="badge badge-returned">No Due</span>
                                    )}
                                </div>

                                <div className="order-description">
                                    {book.description}
                                </div>

                                <button
                                    className="order-return-btn"
                                    onClick={() => handleReturnBook(order.id)}
                                    disabled={order.due}
                                >
                                    {order.due ? "Returned" : "Return Book"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
