import { useNavigate } from "react-router-dom"
import { findAllBooks } from "./CatalogAPI";
import { useEffect, useState } from "react";
import "./CatalogPage.css"
import { FaShoppingCart } from "react-icons/fa";


const CatalogPage = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [totalPages, setTotalPages] = useState(0);


    function retrieveBooks(page, pageSize) {
        console.log(localStorage.getItem('token'))
        findAllBooks(page, pageSize)
            .then(res => {
                setBooks(res.data.content || [])
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

    const handleCart = (book) => {
        alert(`🛒 Added "${book.title}" to cart!`);
    };

    return (

        <div className="catalog-container">
            <h1 className="catalog-title">📚 Book Catalog</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔍 Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="book-grid">
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        <h2 className="book-title">{book.title}</h2>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Stock:</strong> {book.detailedInformation.stockCount}</p>
                        <p><strong>Renewal Fee:</strong> ₹{book.detailedInformation.price}</p>

                        <div className="book-actions">
                            <button onClick={() => handleCart(book)} className="cart-btn">
                                <FaShoppingCart/>Add to Cart
                            </button>
                            <button onClick={() => toggleExpand(book.id)} className="expand-btn">
                                {expanded[book.id] ? "Hide Details ▲" : "View Details ▼"}
                            </button>
                        </div>
                        {/* 
                        <button
                            onClick={() => toggleExpand(book.id)}
                            className="expand-btn"
                        >
                            {expanded[book.id] ? "Hide Details ▲" : "View Details ▼"}
                        </button> */}

                        {expanded[book.id] && (
                            <div className="book-details">
                                <p><strong>Language:</strong> {book.language}</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>Available:</strong> {book.available ? "Yes" : "No"}</p>
                                <p><strong>Damaged:</strong> {book.damage ? "Yes" : "No"}</p>
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
                        Page {page + 1} of {totalPages}
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
                        onChange={(e) => setPageSize(parseInt(e.target.value) || 10)}
                    />
                </div>
            </div>

        </div>
    )

}
export default CatalogPage;