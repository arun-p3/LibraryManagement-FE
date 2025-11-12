import { useNavigate } from "react-router-dom"
import { findAllBooks } from "./CatalogAPI";
import { useEffect, useState, useRef } from "react";
import "./CatalogPage.css"
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import axios from "axios";


const CatalogPage = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(12)
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [account, setAccount] = useState()


    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const dropdownRef = useRef(null);

    const accountInfo = {
        fullName: "Moderator",
        userName: "moderator@archonite.com",
        role: "Admin"
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchAccountDetails = () => {
        const token = localStorage.getItem("token");

        const response = axios.get("http://192.168.1.4:8080/v1/account-management/findById", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        response.then(res => {
            console.log(res.data)
            const account = {
                userName: res.data.userName,
                fullName: res.data.fullName,
                role: res.data.role
            }
            setAccount(account)
        }).catch(e => console.log(e))
    }
    useEffect(
        () => fetchAccountDetails(), []
    )


    const handleLogout = () => {
        setIsAccountOpen(false);
        localStorage.removeItem("token");

        navigate("/");
    };

    function retrieveBooks(page, pageSize) {
        console.log(localStorage.getItem('token'))
        findAllBooks(page, pageSize)
            .then(res => {
                setBooks(res.data.content || [])
                setTotalPages(res.data.totalPages || 0);
                console.log(res)
            }).catch(error => console.log(error.message))
    }

    useEffect(
        () => retrieveBooks(page, pageSize), [page, pageSize]
    )

    const toggleExpand = (bookId) => {
        setExpanded((prev) => ({
            ...prev,
            [bookId]: !prev[bookId],
        }));
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    // Fetch data whenever debouncedSearch changes
    useEffect(() => {
        if (debouncedSearch.length > 2) {

            fetchBooks(debouncedSearch);
        } else {

            retrieveBooks(page, pageSize);
        }
    }, [debouncedSearch, page, pageSize]);

    const fetchBooks = async (keyword = "") => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://192.168.1.4:8080/v1/catalog-management/search", {
                params: {
                    content: keyword
                },
                headers: {
                    Authorization: `Bearer ${token}`
                },

            })
            setBooks(response.data);
            setTotalPages(response.data.totalPages || 0);

        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleCart = (book) => {
        const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const isAlreadyInCart = existingCart.some((b) => b.id === book.id);

        if (!isAlreadyInCart) {
            const updatedCart = [...existingCart, book];
            sessionStorage.setItem("cart", JSON.stringify(updatedCart));
            alert(`${book.title} added to your cart!`);
        } else {
            alert(`${book.title} is already in your cart.`);
        }
    };

    const handleSort = () => {
        if (!sortBy) return;
        const sorted = [...books].sort((a, b) => {
            const aVal = a[sortBy]?.toString().toLowerCase() || "";
            const bVal = b[sortBy]?.toString().toLowerCase() || "";
            if (sortOrder === "asc") return aVal.localeCompare(bVal);
            else return bVal.localeCompare(aVal);
        });
        setBooks(sorted);
    };
    return (

        <div className="catalog-container">
            {/* ===== Modern Header ===== */}
            <header className="header">
                <h1 className="title">Archonite Library</h1>

                <div className="header-right">
                    {/* Cart Button */}
                    <button className="cart-button" onClick={() => navigate("/inventory")}>
                        <FaShoppingCart /> Cart
                    </button>

                    {/* Account Section */}
                    <div className="account-section" ref={dropdownRef}>
                        <button
                            className="account-button"
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                        >
                            <FaUserCircle className="user-icon" />
                            <span>{account?.fullName || accountInfo.fullName}</span>
                        </button>

                        <div className={`dropdown ${isAccountOpen ? "open" : ""}`}>
                            <h2>Account Info</h2>
                            <div className="info">
                                <div>
                                    <strong>Name : </strong>{account?.fullName || accountInfo.fullName}
                                </div>
                                <div>
                                    <strong>User Name : </strong>{account?.userName || accountInfo.userName}
                                </div>
                                <div>
                                    <strong>Role : </strong>{account?.role || accountInfo.role}
                                </div>
                            </div>
                            <button
                                className="history-btn"
                                onClick={() => {
                                    setIsAccountOpen(false);
                                    navigate("/order-history");
                                }}
                            >
                                Books Borrowed
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <h1 className="catalog-title">📚 Book Catalog</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔍 Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {/* 🧭 Sort Section */}
            <div className="sort-section">
                {/* <h3>Sort Options</h3> */}
                <div className="sort-controls">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="">-- Select Field --</option>
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                        <option value="isbn">ISBN</option>
                        <option value="description">Description</option>
                        <option value="language">Language</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="asc">Ascending (A → Z)</option>
                        <option value="desc">Descending (Z → A)</option>
                    </select>

                    <button onClick={handleSort} className="sort-btn">
                        Sort Now
                    </button>
                </div>
            </div>

            <div className="book-grid">
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        <h2 className="book-title">{book.title}</h2>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Stock:</strong> {book.detailedInformation.stockCount}</p>
                        <p><strong>Renewal Fee:</strong> ₹{book.detailedInformation.price}</p>

                        <div className="book-actions">
                            <button
                                onClick={() => handleCart(book)}
                                className="cart-btn"
                                disabled={
                                    book.detailedInformation.stockCount <= 0 ||
                                    !book.detailedInformation.available
                                }
                                style={{
                                    opacity:
                                        book.detailedInformation.stockCount <= 0 ||
                                            !book.detailedInformation.available
                                            ? 0.6
                                            : 1,
                                    cursor:
                                        book.detailedInformation.stockCount <= 0 ||
                                            !book.detailedInformation.available
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>

                            <button onClick={() => toggleExpand(book.id)} className="expand-btn">
                                {expanded[book.id] ? "Hide Details ▲" : "View Details ▼"}
                            </button>
                        </div>


                        {expanded[book.id] && (
                            <div className="book-details">
                                <p><strong>Language:</strong> {book.language}</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>Available:</strong> {book.detailedInformation.available ? "Yes" : "No"}</p>
                                <p><strong>Damaged:</strong> {book.detailedInformation.damage ? "Yes" : "No"}</p>
                                <p><strong>Description:</strong> {book.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination Footer */}
            <div className="pagination-footer">
                <div>
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        className="page-btn"
                    >
                        ◀ Prev
                    </button>

                    <span className="page-info">
                        Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
                    </span>

                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(page + 1)}
                        className="page-btn"
                    >
                        Next ▶
                    </button>
                </div>

                <div className="page-size">
                    <label>Page Size: </label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={pageSize}
                        onChange={(e) => {
                            const newSize = parseInt(e.target.value) || 10;
                            setPageSize(newSize);
                            setPage(0); // reset to first page when size changes
                        }}
                    />
                </div>
            </div>

        </div>
    )

}
export default CatalogPage;