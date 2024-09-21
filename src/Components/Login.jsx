import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from "../Store/UserContextProvider";
import pic from "../assets/images/login.jpg";

export default function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const { login } = useContext(User); // Assuming login is a function in UserContext that handles the API call
    const navigate = useNavigate();

    // Function to handle input changes
    function getData(e) {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // Function to handle login
    async function postData(e) {
        e.preventDefault();

        try {
            const response = await login(user); // Assuming login returns a response with token and user data

            if (response.result === "Done") {
                // Store relevant details in localStorage
                localStorage.setItem("login", "true");
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("name", response.data.name);
                localStorage.setItem("userid", response.data._id);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("token", response.token);

                // Redirect based on the user's role
                if (response.data.role === "Admin") {
                    navigate("/admin-home");
                } else {
                    navigate("/profile");
                }
            } else {
                // Display an error message if login failed
                alert("Invalid Username or Password");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("An error occurred while logging in. Please try again.");
        }
    }

    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <img src={pic} height="500px" width="100%" alt="Login Visual" />
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-2'>Login Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">User Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={getData}
                                placeholder='Enter User Name to Login to Your Account'
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={getData}
                                placeholder='Enter Your Password'
                                required
                            />
                        </div>
                        <button type="submit" className="background text-light mybtn w-100 p-1">Login</button>
                        <div className='d-flex justify-content-between mt-2'>
                            <Link to="/forget-password-username" className='text-decoration-none'>Forget Password</Link>
                            <Link to="/signup" className='text-decoration-none'>New User? Create a Free Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
