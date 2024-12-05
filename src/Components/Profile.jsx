import React, { useState, useEffect, useContext } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom'

import pic from "../assets/images/noimage.png"
import { User } from "../Store/UserContextProvider"
import { Wishlist } from "../Store/WishlistContextProvider"
import { Checkout } from "../Store/CheckoutContextProvider"

export default function Profile() {
    const [user, setUser] = useState({});
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);

    const { getSingle } = useContext(User);
    const { getWishlist, deleteData } = useContext(Wishlist);
    const { getCheckoutUser } = useContext(Checkout);

    async function getAPIData() {
        try {
            // Fetch user data
            const userResponse = await getSingle();
            setUser(userResponse.data || {});

            // Fetch wishlist data
            const wishlistResponse = await getWishlist();
            setWishlist(wishlistResponse.data || []); // Set fallback to an empty array if undefined

            // Fetch orders/checkout data
            const ordersResponse = await getCheckoutUser();
            setOrders(ordersResponse.data || []); // Set fallback to an empty array if undefined
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this?")) {
            await deleteData({ _id });
            getAPIData(); // Re-fetch the data after deletion
        }
    }

    useEffect(() => {
        getAPIData();
    }, []);

    return (
        <div className='container-fluid mt-2'>
            {/* User Profile Section */}
            <div className='row'>
                <div className='col-md-6 col-12'>
                    {user.pic ?
                        <img src={`./public/uploads/${user.pic}`} className="img-fluid rounded" alt='Profile' /> :
                        <img src={pic} className="img-fluid rounded" alt='Default' />
                    }
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Buyer Profile Section</h5>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>Full Name</th>
                                <td>{user.name || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>User Name</th>
                                <td>{user.username || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Email Address</th>
                                <td>{user.email || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{user.phone || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>House Number or Building Number</th>
                                <td>{user.addressline1 || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Street Number or Near By</th>
                                <td>{user.addressline2 || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Village or Locality</th>
                                <td>{user.addressline3 || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>PIN</th>
                                <td>{user.pin || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>City</th>
                                <td>{user.city || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>State</th>
                                <td>{user.state || "N/A"}</td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <Link to="/update-profile" className='btn btn-primary w-100'>
                                        Update Profile
                                    </Link>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Wishlist Section */}
            {wishlist && wishlist.length >= 1 ? (
                <>
                    <h5 className='background text-light text-center p-2 mt-2'>Wishlist Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Maincategory</th>
                                    <th>Subcategory</th>
                                    <th>Brand</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Price</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlist.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img src={`./public/uploads/${item.pic}`} className="img-fluid rounded" alt='' style={{ width: '100px', height: '70px' }} />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.maincategory}</td>
                                        <td>{item.subcategory}</td>
                                        <td>{item.brand}</td>
                                        <td>{item.color}</td>
                                        <td>{item.size}</td>
                                        <td>&#8377;{item.price ? item.price.toFixed(0) : ""}</td>
                                        <td>
                                            <Link className='btn btn-sm btn-outline-primary' to={`/get-single-product/${item.productid}`}>
                                                <AddShoppingCartIcon />
                                            </Link>
                                        </td>
                                        <td>
                                            <button className='btn btn-sm btn-outline-danger' onClick={() => deleteRecord(item._id)}>
                                                <DeleteForeverIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <h5 className='background text-light text-center p-2 mt-2'>No Items in Wishlist</h5>
            )}

            {/* Order History Section */}
            {orders && orders.length >= 1 ? (
                <>
                    <h5 className='background text-light text-center p-2 mt-2'>Order History Section</h5>
                    {orders.map((order, index) => (
                        <div className='row' key={index}>
                            <div className='col-lg-3 col-md-4 col-12'>
                                <div className='table-responsive'>
                                    <table className='table table-striped'>
                                        <tbody>
                                            <tr>
                                                <th>Order Id</th>
                                                <td>{order._id}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Mode</th>
                                                <td>{order.paymentmode}</td>
                                            </tr>
                                            <tr>
                                                <th>Order Status</th>
                                                <td>{order.orderstatus}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Status</th>
                                                <td>
                                                    {order.paymentstatus}
                                                    {order.paymentstatus === "Pending" ? (
                                                        <Link to={`/payment/${order._id}`} className='btn btn-sm btn-primary'>
                                                            Pay Now
                                                        </Link>
                                                    ) : ""}
                                                </td>
                                            </tr>
                                            {order.rppid && (
                                                <tr>
                                                    <th>RPPID</th>
                                                    <td>{order.rppid}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <th>Total</th>
                                                <td>&#8377;{order.totalamount}</td>
                                            </tr>
                                            <tr>
                                                <th>Shipping</th>
                                                <td>&#8377;{order.shippingamount}</td>
                                            </tr>
                                            <tr>
                                                <th>Final</th>
                                                <td>&#8377;{order.finalamount}</td>
                                            </tr>
                                            <tr>
                                                <th>Date</th>
                                                <td>{`${new Date(order.date).getDate()}/${new Date(order.date).getMonth() + 1}/${new Date(order.date).getFullYear()}`}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='col-lg-9 col-md-8 col-12'>
                                <h5 className='background text-light text-center p-2 mt-2'>Products in Order</h5>
                                <div className='table-responsive'>
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Maincategory</th>
                                                <th>Subcategory</th>
                                                <th>Brand</th>
                                                <th>Color</th>
                                                <th>Size</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.products && order.products.map((product, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <img src={`./public/uploads/${product.pic}`} className="img-fluid rounded" alt='' style={{ width: '100px', height: '70px' }} />
                                                    </td>
                                                    <td>{product.name}</td>
                                                    <td>{product.maincategory}</td>
                                                    <td>{product.subcategory}</td>
                                                    <td>{product.brand}</td>
                                                    <td>{product.color}</td>
                                                    <td>{product.size}</td>
                                                    <td>&#8377;{product.price ? product.price.toFixed(0) : ""}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr style={{ border: "5px solid lightgray" }} />
                        </div>
                    ))}
                </>
            ) : (
                <h5 className='background text-light text-center p-2 mt-2'>No Order History</h5>
            )}
        </div>
    );
}
