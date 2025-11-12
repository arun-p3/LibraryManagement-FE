import logo from './logo.svg';
import HomePage from './component/home-page/HomePage';
import SignUpPage from './component/signup-page/SignUpPage';
import LoginPage from './component/login-page/LoginPage';
import CatalogPage from './component/catalog/CatalogPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import InventoryPage from './component/inventory/InventoryPage';
import OrderHistory from './component/borrowing-history/OrderHistory';
import AdminPage from './component/admin-page/AdminPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path= "/inventory" element={<InventoryPage />} />
          <Route path= "/order-history" element={<OrderHistory />} />
          <Route path= "/admin-view" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
