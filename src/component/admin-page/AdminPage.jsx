import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";
import { updateUser } from "./AdminAPI";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [updateUser, setUpdateUser] = useState(null); // user object to update
    const [updateForm, setUpdateForm] = useState({
        fullName: "",
        userName: "",
        password: "",
        role: "USER", // default role
    });

    const [expanded, setExpanded] = useState({});

    const baseUrl = "http://192.168.1.4:8080";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${baseUrl}/v1/account-management/admin/find`, {
                params: {
                    page: 0,
                    pageSize: 10
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.content);
            setFilteredUsers(res.data.content);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearch(keyword);
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.fullName.toLowerCase().includes(keyword) ||
                    user.userName.toLowerCase().includes(keyword) ||
                    user.role.toLowerCase().includes(keyword)
            )
        );
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${baseUrl}/v1/account-management/admin/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user.id !== id));
            setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    const handleUpdate = async (user) => {
        setUpdateUser(user);
        setUpdateForm({
            id: user.id,
            fullName: user.fullName,
            userName: user.userName,
            password: "", // leave blank, user can update if needed
            role: user.role,
        });
        // You can navigate to an update form or open modal
    };

    const handleUpdateChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
    };

    const submitUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const requestBody = {
                id: updateForm.id,
                fullName: updateForm.fullName,
                userName: updateForm.userName,
                password: updateForm.password,
                role: updateForm.role,
            };

            await axios.put(
                "http://192.168.1.4:8080/v1/account-management/admin/update",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("User updated successfully!");
            setUpdateUser(null); // close modal
            // refresh user list if needed
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.["error message"] || "Update failed");
        }
    };

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="users-container">
            <h1 className="users-title">👥 All Users</h1>

            <div className="users-search">
                <input
                    type="text"
                    placeholder="🔍 Search by name, username, or role..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="users-grid">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="user-card">
                        <h2>{user.fullName}</h2>
                        <p><strong>Username:</strong> {user.userName}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Orders:</strong> {user.orders?.length || 0}</p>

                        <div className="user-actions flex-space-between">
                            <button
                                className="update-btn"
                                onClick={() => handleUpdate(user)}
                            >
                                Update
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(user.id)}
                            >
                                Delete
                            </button>
                        </div>



                        {user.orders && user.orders.length > 0 ? (
                            <div style={{ marginTop: "10px", textAlign: "center" }}>
                                <button
                                    className="expand-orders-btn"
                                    onClick={() => toggleExpand(user.id)}
                                >
                                    {expanded[user.id] ? "Hide Orders ▲" : "Show Orders ▼"}
                                </button>

                                {expanded[user.id] &&
                                    user.orders.map((order) => (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                                <p><strong>Return Date:</strong> {new Date(order.returnDate).toLocaleDateString()}</p>
                                                <span className={`due-status ${new Date(order.returnDate) < new Date() ? "due" : "no-due"}`}>
                                                    {new Date(order.returnDate) < new Date() ? "Due" : "No Due"}
                                                </span>
                                            </div>

                                            {order.book.map((book) => (
                                                <div key={book.id} className="book-details-card">
                                                    <p className="book-title">{book.title}</p>
                                                    <p><strong>Author:</strong> {book.author}</p>
                                                    <p><strong>ISBN:</strong> {book.isbn}</p>
                                                    <p><strong>Language:</strong> {book.language}</p>
                                                    <p><strong>Price:</strong> ₹{book.detailedInformation.price}</p>
                                                    <p className="book-desc">{book.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: "center", marginTop: "10px", color: "#6b7280" }}>
                                No Borrowed History
                            </p>
                        )}
                    </div>
                ))}

            </div>
            {updateUser && (
                <div className="update-modal">
                    <div className="update-modal-content">
                        <h3>Update User</h3>
                        <div className="update-form">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={updateForm.fullName}
                                onChange={handleUpdateChange}
                            />
                            <input
                                type="text"
                                name="userName"
                                placeholder="Username"
                                value={updateForm.userName}
                                onChange={handleUpdateChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password (optional)"
                                value={updateForm.password}
                                onChange={handleUpdateChange}
                            />
                            <select
                                name="role"
                                value={updateForm.role}
                                onChange={handleUpdateChange}
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                            </select>

                            <div className="update-modal-buttons">
                                <button onClick={submitUpdate} className="update-btn">Save</button>
                                <button onClick={() => setUpdateUser(null)} className="delete-btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
