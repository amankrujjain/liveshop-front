import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pic from "../assets/images/signup.jpg";
import { User } from '../Store/UserContextProvider'; // Ensure the correct context
import { startWebAuthnRegistration, verifyWebAuthnRegistration } from '../utils/WebAuthnUtils'; // Ensure these utilities are correct
import { toast } from 'react-hot-toast'

export default function Signup() {
    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    });
    const { add } = useContext(User); // Context to add user
    const navigate = useNavigate();

    const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);

    useEffect(() => {
        if (window.PublicKeyCredential) {
            toast.success("WebAuthn is supported");
            setIsWebAuthnSupported(true);
        } else {
            toast.error("WebAuthn is not supported");
            setIsWebAuthnSupported(false);
        }
    }, []);


    // Handle form data
    function getData(e) {
        const name = e.target.name;
        const value = e.target.value;
        setUser((old) => ({
            ...old,
            [name]: value
        }));
    }

    // Handle form submission
    async function postData(e) {
        e.preventDefault();
        if (user.password === user.cpassword) {
            const newUser = {
                ...user,
                role: "User"
            };

            // Add user through context
            const response = await add(newUser);
            console.log("Response in sign up", response)
            if (response.status === true) {
                if (isWebAuthnSupported) {
                    try {
                        const attestationResponse = await startWebAuthnRegistration(user.username);
                        console.log("Attestation created Response", attestationResponse);

                        // Verify the WebAuthn registration with the backend
                        const verifyResponse = await verifyWebAuthnRegistration(user.username, attestationResponse);


                        if (verifyResponse.result === "Done") {
                            toast.success("Account Created Successfully", {
                                icon: '🎉',
                            });
                            navigate("/login");
                        } else {
                            toast.error("Device Registration Failed: " + verifyResponse.message);
                        }
                    } catch (error) {
                        console.error("Error during WebAuthN process:", error);
                        toast.error("Device setup could not be initiated.");
                    }
                } else {
                    toast.error("Signup Successful, but device is not supported.",{
                        icon:"⚠️",
                    });
                    navigate("/login");
                }
            } else {
                console.log("Response message", response.message)
                toast.error(response.message);
                navigate('/login')
            }
        } else {
            toast.error("Password and Confirm Password do not match!");
        }
    };
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <img src={pic} height="500px" width="100%" alt="Signup" />
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-2'>SignUp Section</h5>
                    <form onSubmit={postData}>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Full Name<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="name" placeholder='Enter User Full Name' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">User Name<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="username" placeholder='Enter User Name' />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Email Id<span className='text-danger'>*</span></label>
                                <input type="email" required className="form-control" onChange={getData} name="email" placeholder='Enter Email Address' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Phone<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="phone" placeholder='Enter Phone Number' />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Password<span className='text-danger'>*</span></label>
                                <input type="password" required className="form-control" onChange={getData} name="password" placeholder='Enter Your Password' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Confirm Password<span className='text-danger'>*</span></label>
                                <input type="password" required className="form-control" onChange={getData} name="cpassword" placeholder='Confirm Password' />
                            </div>
                        </div>
                        <button type="submit" className="background mybtn text-light  w-100 btn-sm p-1">Signup</button>
                        <Link to="/login" className='text-decoration-none mt-2'>Already Have an Account? Login</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
