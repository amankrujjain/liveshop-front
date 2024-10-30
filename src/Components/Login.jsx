import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from "../Store/UserContextProvider";
import pic from "../assets/images/login.jpg";
import { startWebAuthnLogin, verifyWebAuthnLogin } from '../utils/WebAuthnUtils'; // Imported the utils
import toast from 'react-hot-toast';

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

    // Function to handle password-based login
    async function postData(e) {
        e.preventDefault();

        try {
            // Validate that both username and password are provided for normal login
            if (!user.username || !user.password) {
                toast.error("Username and Password are required for normal login.",{
                    icon:"⚠️"
                });
                return;
            }

            const response = await login(user); // Assuming login returns a response with token and user data

            if (response.result === "Done") {
                toast.success("Successfully logged in")
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
                toast.error("Invalid Username or Password",{
                    icon:"⚠️"
                });
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("An error occurred while logging in. Please try again.");
        }
    }

    // Function to handle WebAuthn device login (passwordless login)
    async function loginWithDevice() {
        try {
            if (!user.username) {
                toast.error("Username is required for device login.",{
                    icon:"⚠️"
                });
                return;
            }

            // Start WebAuthn login (authentication)
            const authResponse = await startWebAuthnLogin(user.username);

            // Send the authentication response to the server for verification
            const verificationResponse = await verifyWebAuthnLogin(user.username, authResponse);

            console.log("Inside login jsx verification response", verificationResponse)

            if (verificationResponse.verified) {
                toast.success("Login successful")
                // Store relevant details in localStorage upon successful verification
                localStorage.setItem("login", "true");
                localStorage.setItem("username", verificationResponse.data.username);
                localStorage.setItem("name", verificationResponse.data.name);
                localStorage.setItem("userid", verificationResponse.data._id);
                localStorage.setItem("role", verificationResponse.data.role);
                localStorage.setItem("token", verificationResponse.token);

                // Redirect based on the user's role
                if (verificationResponse.data.role === "Admin") {
                    navigate("/admin-home");
                } else {
                    navigate("/profile");
                }
            } else {
                toast.error("Authentication failed, please try again.");
            }
        } catch (error) {
            console.error("WebAuthn Login Error:", error);
            toast.error("An error occurred while logging in with device. Please try again.");
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
                                placeholder='Enter Your Password (or leave blank for device login)'
                            />
                        </div>
                        {/* Normal login (username and password) */}
                        <button type="submit" className="background text-light mybtn w-100 p-1">Login</button>

                        {/* WebAuthn Device Login (Passwordless Login) */}
                        <button 
                            type="button" 
                            className="background text-light mybtn mt-4 w-100 p-1"
                            onClick={loginWithDevice}
                        >
                            Login With Device
                        </button>

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
