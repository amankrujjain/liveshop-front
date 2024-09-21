import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { User } from "../Store/UserContextProvider"
import { Cart } from "../Store/CartContextProvider"
import { Checkout as CheckoutContext } from "../Store/CheckoutContextProvider"
export default function Checkout() {
    var [user, setuser] = useState({})
    var [cart, setcart] = useState([])
    var [mode, setmode] = useState("COD")

    var { getSingle } = useContext(User)
    var { getCart, deleteAll } = useContext(Cart)
    var { add } = useContext(CheckoutContext)
    var [total, settotal] = useState(0)
    var [shipping, setshipping] = useState(0)
    var [final, setfinal] = useState(0)
    var navigate = useNavigate()
    async function getAPIData() {
        var item = {
            _id: localStorage.getItem("userid")
        }
        var response = await getSingle(item)
        setuser(response.data)
        item = {
            userid: localStorage.getItem("userid")
        }
        response = await getCart(item)
        setcart(response.data)
        let total = 0
        let shipping = 0
        let final = 0
        for (let item of response.data) {
            total = total + item.total
        }
        if (total < 1000 && response.data.length >= 1)
            shipping = 150
        final = shipping + total
        settotal(total)
        setshipping(shipping)
        setfinal(final)
    }
    function getData(e) {
        setmode(e.target.value)
    }
    async function PlaceOrder() {
        var item = {
            userid: localStorage.getItem("userid"),
            paymentmode: mode,
            totalamount: total,
            shippingamount: shipping,
            finalamount: final,
            date: new Date(),
            products: cart
        }
        var response = await add(item)
        if (response.result === "Done") {
            if (mode === "COD"){
            navigate("/confirm")
            await deleteAll()
            navigate("/confirmation")
            }
            else
                navigate("/payment/-1")
            
        }
        else
            alert(response.message)
    }
    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Billing Details</h5>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>Full Name</th>
                                <td>{user.name}</td>
                            </tr>
                            <tr>
                                <th>User Name</th>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <th>Email Address</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{user.phone}</td>
                            </tr>
                            <tr>
                                <th>House Number or Building Number</th>
                                <td>{user.addressline1}</td>
                            </tr>
                            <tr>
                                <th>Street Number or Near By</th>
                                <td>{user.addressline2}</td>
                            </tr>
                            <tr>
                                <th>Village or Locality</th>
                                <td>{user.addressline3}</td>
                            </tr>
                            <tr>
                                <th>PIN</th>
                                <td>{user.pin}</td>
                            </tr>
                            <tr>
                                <th>City</th>
                                <td>{user.city}</td>
                            </tr>
                            <tr>
                                <th>State</th>
                                <td>{user.state}</td>
                            </tr>
                            <tr>
                                <th colSpan={2}><Link to="/update-profile" className='text-decoration-none p-1 d-block text-center rounded background text-light mybtn w-100 btn-sm'>Update Profile</Link></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Cart Details</h5>
                    <div className='table-responsive'>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                </tr>
                                {
                                    cart.map((item, index) => {
                                        return <tr key={index}>
                                            <td><img src={`./public/uploads/${item.pic}`} width="70px" height="50px" className="rounded" alt='cart' /></td>
                                            <td>{item.name}</td>
                                            <td>{item.color}</td>
                                            <td>{item.size}</td>
                                            <td>&#8377;{item.price ? item.price.toFixed(0) : ""}</td>
                                            <td>{item.qty}</td>
                                            <td>&#8377;{item.total ? item.total.toFixed(0) : ""}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <th>Total Amount</th>
                                    <td>&#8377;{total}</td>
                                </tr>
                                <tr>
                                    <th>Shipping Amount</th>
                                    <td>&#8377;{shipping}</td>
                                </tr>
                                <tr>
                                    <th>Final Amount</th>
                                    <td>&#8377;{final}</td>
                                </tr>
                                <tr className='mb-3'>
                                    <th>Payment Mode</th>
                                    <td>
                                        <select name='mode' onChange={getData} className="form-select">
                                            <option value="COD">COD</option>
                                            <option value="Net Banking">Net Banking/Cart/UPI</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    {
                                        cart.length >= 1 ?
                                            <td colSpan={2}><button onClick={PlaceOrder} className='text-decoration-none d-block rounded text-center w-100 formbtn background text-light'>Place Order</button></td> : <td></td>
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
