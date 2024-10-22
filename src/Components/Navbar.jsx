import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/style.css";
const backendUrl =process.env.NODE_ENV==="production"?"https://liveshop-back.onrender.com":'http://localhost:8000'; 

export default function Navbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    function getData(e) {
        setSearch(e.target.value);
    }

    function postData(e) {
        e.preventDefault();
        navigate("/shop/All/All/All/" + search);
        setSearch("");
    }

    async function logout() {
        try {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            const sessionID = localStorage.getItem("SessionID");  // Retrieve sessionID from localStorage
    
            console.log(token);
            console.log(username);
            console.log(sessionID);
    
            const response = await fetch(`${backendUrl}/logout`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    token: token,
                    sessionID: sessionID  // Include sessionID in the logout request
                })
            });
    
            const data = await response.json();
    
            // Check if the logout was successful
            if (response.ok && data.result === "Done") {
                localStorage.clear();  // Clear localStorage after logout
                navigate("/login");    // Redirect user to login page
            } else {
                alert("Failed to log out: " + data.message); // Handle the error message in UI
            }
        } catch (error) {
            console.error("Logout Error:", error);
            alert("An error occurred during logout. Please try again.");
        }
    }
    
    async function logoutAll() {
        try {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            console.log(token)
            console.log(username)
            const response = await fetch(`${backendUrl}/logoutall`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    token: token
                })
            });

            const data = await response.json();

            // Check if the logout-all was successful
            if (response.ok && data.result === "Done") {
                localStorage.clear();
                navigate("/login");
            } else {
                alert("Failed to log out from all devices: " + data.message); // Handle error message.
            }
        } catch (error) {
            console.error("Logout All Error:", error);
            alert("An error occurred during logout from all devices. Please try again.");
        }
    }

    useEffect(() => { }, []);

    return (
        <nav className="navbar navbar-expand-lg background sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand text-light" to="/">LiveShop</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-light active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light" to="/shop/All/All/All/None">Shop</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light" to="/contact">Contact</Link>
                        </li>
                    </ul>
                    <form className="d-flex" role="search" onSubmit={postData}>
                        <input className="form-control me-2" type="search" name='search' onChange={getData} placeholder="Search" aria-label="Search" value={search} />
                        <button className="btn btn-outline-light" type="submit">Search</button>
                    </form>
                    <div>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {
                                localStorage.getItem("login") ?
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link text-light dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {localStorage.getItem("name")}
                                        </Link>
                                        <ul className="dropdown-menu">
                                            {
                                                localStorage.getItem("role") === "Admin" ?
                                                    <li><Link className="dropdown-item" to="/admin-home">Profile</Link></li> :
                                                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                            }
                                            <li><Link className="dropdown-item" to="/cart">Cart</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                                            <li><button className="dropdown-item" onClick={logoutAll}>Logout All</button></li>
                                        </ul>
                                    </li> :
                                    <li className="nav-item">
                                        <Link className="nav-link text-light" to="/login">Login</Link>
                                    </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
