import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import LeftNav from './LeftNav'

import { Checkout } from '../../Store/CheckoutContextProvider';
export default function AdminSingleCheckout() {
    var [checkout, setcheckout] = useState([])
    var [status, setstatus] = useState("Order Placed")
    var [payment, setpayment] = useState("Pending")
    var { getSingle, update } = useContext(Checkout)
    var { _id } = useParams()
    async function getAPIData() {
        var item = {
            _id: _id
        }
        var response = await getSingle(item)
        if (response.result === "Done") {
            setcheckout(response.data)
            setstatus(response.data.status)
            setpayment(response.data.paymentstatus)
        }
        else
            alert(response.message)
    }
    function getData(e) {
        if (e.target.name === "status")
            setstatus(e.target.value)
        else
            setpayment(e.target.value)
    }
    async function updateRecord() {
        var item = {
            _id: _id,
            orderstatus: status,
            paymentstatus: payment
        }
        const response = await update(item)
        if (response.result === "Done")
            getAPIData()
    }
    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
                    <LeftNav />
                </div>
                <div className='col-lg-10 col-md-8 col-sm-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Single Checkout Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <td>{checkout._id}</td>
                                </tr>
                                <tr>
                                    <th>Payment Mode</th>
                                    <td>{checkout.paymentmode}</td>
                                </tr>
                                <tr>
                                    <th>Order Status</th>
                                    <td>
                                        {checkout.orderstatus}
                                        {
                                            checkout.orderstatus !== 'Delivered' ?
                                                <select name="status" className='form-select' onChange={getData}>
                                                    <option value="Packed">Packed</option>
                                                    <option value="Prepare for Dispatch">Prepare for Dispatch</option>
                                                    <option value="Dispatched">Dispatched</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="In Transit">In Transit</option>
                                                    <option value="Order Reached at Final Delivery Station">Order Reached at Final Delivery Station</option>
                                                    <option value="Out For Delivery">Out For Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select> : ""
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Payment Status</th>
                                    <td>
                                        {checkout.paymentstatus}
                                        {
                                            checkout.paymentstatus !== 'Done' && checkout.paymentmode === "COD" ?
                                                <select name="payment" className='form-select' onChange={getData}>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Done">Done</option>
                                                </select> : ""
                                        }
                                    </td>
                                </tr>
                                {
                                    checkout.paymentmode !== "COD" ?
                                        <tr>
                                            <th>RPPID</th>
                                            <td>{checkout.rppid}</td>
                                        </tr> : ""
                                }
                                <tr>
                                    <th>Total Amount</th>
                                    <td>&#8377;{checkout.totalamount}</td>
                                </tr>
                                <tr>
                                    <th>Shipping Amount</th>
                                    <td>&#8377;{checkout.shippingamount}</td>
                                </tr>
                                <tr>
                                    <th>Final Amount</th>
                                    <td>{checkout.finalamount}</td>
                                </tr>
                                <tr>
                                    <th>Date</th>
                                    <td>{checkout.date ? `${new Date(checkout.date).getDate()}/${new Date(checkout.date).getMonth() + 1}/${new Date(checkout.date).getFullYear()} ${new Date(checkout.date).getHours()}:${new Date(checkout.date).getMinutes()}:${new Date(checkout.date).getSeconds()}` : ""}</td>
                                </tr>

                                <tr>
                                    <td colSpan={2}>
                                        {checkout.status !== "Delivered" || checkout.paymentstatus !== "Done" ?
                                            <button className='w-100 formbtn background text-light' onClick={updateRecord}>Update</button>
                                            : ""}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h5 className='background text-light text-center p-2 mt-2'>Products in Order</h5>
                    <div className='table-responsive'>
                        <table className='table'>
                            <tbody>
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
                                {
                                    checkout.products && checkout.products.map((item, index) => {
                                        return <tr key={index}>
                                            <td><img src={`/public/uploads/${item.pic}`} width="100px" height="70px" className="rounded" alt='checkout' /></td>
                                            <td>{item.name}</td>
                                            <td>{item.maincategory}</td>
                                            <td>{item.subcategory}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.color}</td>
                                            <td>{item.size}</td>
                                            <td>&#8377;{item.price ? item.price.toFixed(0) : ""}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
