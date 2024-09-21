import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import LeftNav from './LeftNav'

import { Checkout } from '../../Store/CheckoutContextProvider';
export default function AdminCheckout() {
    var [checkout, setcheckout] = useState([])
    var { getCheckout} = useContext(Checkout)
    async function getAPIData() {
        var response = await getCheckout()
        if (response.result === "Done")
            setcheckout(response.data)
        else
            alert(response.message)
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
                    <h5 className='background text-light text-center p-1'>Checkout Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <th>Mode</th>
                                    <th>Status</th>
                                    <th>Payment Status</th>
                                    <th>Total</th>
                                    <th>Shipping</th>
                                    <th>Final</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                                {
                                    checkout.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>{item.paymentmode}</td>
                                            <td>{item.orderstatus}</td>
                                            <td>{item.paymentstatus}</td>
                                            <td>&#8377;{item.totalamount}</td>
                                            <td>&#8377;{item.shippingamount}</td>
                                            <td>&#8377;{item.finalamount}</td>
                                            <td>{`${new Date(item.date).getDate()}/${new Date(item.date).getMonth()+1}/${new Date(item.date).getFullYear()} ${new Date(item.date).getHours()}:${new Date(item.date).getMinutes()}:${new Date(item.date).getSeconds()}`}</td>
                                            <td><Link to={`/admin-single-checkout/${item._id}`}><RemoveRedEyeIcon/></Link></td>
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
