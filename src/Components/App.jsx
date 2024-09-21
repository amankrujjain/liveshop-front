import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { initWebSocket } from '../utils/socketConnection';

// Import components
import AdminHome from './Admin/AdminHome';
import AdminMaincategory from './Admin/AdminMaincategory';
import AdminAddMaincategory from './Admin/AdminAddMaincategory';
import AdminUpdateMaincategory from './Admin/AdminUpdateMaincategory';
import AdminAddSubcategory from './Admin/AdminAddSubcategory';
import AdminSubcategory from './Admin/AdminSubcategory';
import AdminUpdateSubcategory from './Admin/AdminUpdateSubcategory';
import AdminAddBrand from './Admin/AdminAddBrand';
import AdminBrand from './Admin/AdminBrand';
import AdminUpdateBrand from './Admin/AdminUpdateBrand';
import AdminAddProduct from './Admin/AdminAddProduct';
import AdminProduct from './Admin/AdminProduct';
import AdminUpdateProduct from './Admin/AdminUpdateProduct';
import AdminUserList from './Admin/AdminUserList'; // Add the missing component import
import UpdateProfile from './UpdateProfile';
import AdminCheckout from './Admin/AdminCheckout'
import AdminSingleCheckout from './Admin/AdminSingleCheckout';
import AdminContact from './Admin/AdminContact'
import AdminSingleContact from './Admin/AdminSingleContact';
import AdminNewslatter from './Admin/AdminNewslatter'

import Footer from './Footer';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Cart from './Cart';
import Checkout from './Checkout';
import Confirmation from './Confirmation';
import SingleProductPage from './SingleProductPage'; // Import the SingleProductPage
import Shop from './Shop';
import Signup from './Signup';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            return true;
        }
    };

    useEffect(() => {
        // Initialize WebSocket connection when the app loads
        initWebSocket();

        // Handle network status (online/offline)
        const handleOffline = () => {
            alert("No internet connection found.");
        };

        const handleOnline = () => {
            alert("Internet connection restored.");
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Clean up the event listeners on component unmount
        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (token && !isTokenExpired(token)) {
            setIsLoggedIn(true);
            setRole(userRole);
        } else {
            localStorage.clear();
            setIsLoggedIn(false);
            setRole(null);
        }

        setIsLoading(false);
    }, []);

    const ProtectedRoute = ({ children, adminOnly = false }) => {
        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (!isLoggedIn) {
            return <Navigate to="/login" />;
        }
        if (adminOnly && role !== 'Admin') {
            return <Navigate to="/profile" />;
        }
        return children;
    };

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/signup' element={<Signup/>}/>
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
                <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
                <Route path="/confirmation" element={isLoggedIn ? <Confirmation /> : <Navigate to="/login" />} />
                <Route path='/update-profile' element={isLoggedIn ? <UpdateProfile /> : <Navigate to='/login' />} />

                {/* Single Product Route */}
                <Route path="/single-product/:id" element={<SingleProductPage />} />
                <Route path="/shop/:mc/:sc/:br/:search" element={<Shop />} />

                {/* Admin Routes */}
                <Route path="/admin-home" element={<ProtectedRoute adminOnly={true}><AdminHome /></ProtectedRoute>} />
                <Route path="/admin-maincategory" element={<ProtectedRoute adminOnly={true}><AdminMaincategory /></ProtectedRoute>} />
                <Route path="/admin-add-maincategory" element={<ProtectedRoute adminOnly={true}><AdminAddMaincategory /></ProtectedRoute>} />
                <Route path="/admin-update-maincategory/:_id" element={<ProtectedRoute adminOnly={true}><AdminUpdateMaincategory /></ProtectedRoute>} />
                <Route path="/admin-subcategory" element={<ProtectedRoute adminOnly={true}><AdminSubcategory /></ProtectedRoute>} />
                <Route path="/admin-add-subcategory" element={<ProtectedRoute adminOnly={true}><AdminAddSubcategory /></ProtectedRoute>} />
                <Route path="/admin-update-subcategory/:_id" element={<ProtectedRoute adminOnly={true}><AdminUpdateSubcategory /></ProtectedRoute>} />
                <Route path="/admin-brand" element={<ProtectedRoute adminOnly={true}><AdminBrand /></ProtectedRoute>} />
                <Route path="/admin-add-brand" element={<ProtectedRoute adminOnly={true}><AdminAddBrand /></ProtectedRoute>} />
                <Route path="/admin-update-brand/:_id" element={<ProtectedRoute adminOnly={true}><AdminUpdateBrand /></ProtectedRoute>} />
                <Route path="/admin-product" element={<ProtectedRoute adminOnly={true}><AdminProduct /></ProtectedRoute>} />
                <Route path="/admin-add-product" element={<ProtectedRoute adminOnly={true}><AdminAddProduct /></ProtectedRoute>} />
                <Route path="/admin-update-product/:_id" element={<ProtectedRoute adminOnly={true}><AdminUpdateProduct /></ProtectedRoute>} />

                {/* Add missing Admin User List route */}
                <Route path="/admin-userlist" element={<ProtectedRoute adminOnly={true}><AdminUserList /></ProtectedRoute>} />
                <Route path="/admin-checkout" element={<ProtectedRoute adminOnly={true}><AdminCheckout /></ProtectedRoute>} />
                <Route path="/admin-single-checkout/:_id" element={<ProtectedRoute adminOnly={true}><AdminSingleCheckout /></ProtectedRoute>} />
                <Route path="/admin-contact" element={<ProtectedRoute adminOnly={true}><AdminContact /></ProtectedRoute>} />
                <Route path="/Admin-single-contact/:_id" element={<ProtectedRoute adminOnly={true}><AdminSingleContact /></ProtectedRoute>} />
                <Route path="/admin-newslatter" element={<ProtectedRoute adminOnly={true}><AdminNewslatter /></ProtectedRoute>} />



            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
