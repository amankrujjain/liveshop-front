import React, { useState, useContext, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


import { Cart as CartContext } from '../Store/CartContextProvider'
import { Link } from 'react-router-dom';
export default function Cart() {
    var [cart, setcart] = useState([])
    var [total, settotal] = useState(0)
    var [shipping, setshipping] = useState(0)
    var [final, setfinal] = useState(0)
    var { getCart, update, deleteData } = useContext(CartContext)
    async function getAPIData() {
        const response = await getCart()
        setcart(response.data)
        let total = 0
        let shipping = 0
        let final = 0
        for(let item of response.data){
            total=total+item.total
        }
        if(total<1000 && response.data.length>=1)
        shipping=150
        final = shipping+total
        settotal(total)
        setshipping(shipping)
        setfinal(final)
    }
    async function deleteRecord(_id) {
        if (window.confirm("Are Your Sure to Delete : ")) {
            var item = {
                _id: _id
            }
            await deleteData(item)
            getAPIData()
        }
    }
    async function updateRecord(_id, operation) {
        var c = cart.find(item => item._id === _id)
        if (operation === "DEC" && c.qty === 1)
            return
        else if (operation === "INC") {
            c.qty = c.qty + 1
            c.total = c.total + c.price
        }
        else {
            c.qty = c.qty - 1
            c.total = c.total - c.price
        }
        var item = {
            id: c._id,
            qty: c.qty,
            total: c.total
        }
        const response = await update(item)
        if (response.result === "Done")
            getAPIData()
        else
            alert(response.message)
    }
    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <div className="container-fluid">
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
                            <th>Qty</th>
                            <th></th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                        {
                            cart.map((item, index) => {
                                return <tr key={index}>
                                    <td><img src={`./public/uploads/${item.pic}`} width="100px" height="70px" className="rounded" alt='cart' /></td>
                                    <td>{item.name}</td>
                                    <td>{item.maincategory}</td>
                                    <td>{item.subcategory}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.color}</td>
                                    <td>{item.size}</td>
                                    <td>&#8377;{item.price ? item.price.toFixed(0) : ""}</td>
                                    <td><button className='btn mybtn text-danger' onClick={() => updateRecord(item._id, "DEC")}><RemoveIcon /></button></td>
                                    <td>{item.qty}</td>
                                    <td><button className='btn mybtn text-danger' onClick={() => updateRecord(item._id, "INC")}><AddIcon /></button></td>
                                    <td>&#8377;{item.total ? item.total.toFixed(0) : ""}</td>
                                    <td><button className='btn mybtn text-danger' onClick={() => deleteRecord(item._id)}><DeleteForeverIcon /></button></td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className='row'>
            <div className='col-md-6 col-12'></div>
                <div className='col-md-6 col-12'>
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
                            <tr>
                                {
                                    cart.length>=1?<td colSpan={2}><Link to="/checkout" className='text-decoration-none d-block rounded text-center w-100 formbtn background text-light'>Checkout</Link></td>:<td></td>
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
