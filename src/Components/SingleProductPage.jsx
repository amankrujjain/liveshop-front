import React, { useState, useEffect, useContext } from 'react'
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'

import { Product as ProductContext } from '../Store/ProductContextProvider'
import { Cart } from '../Store/CartContextProvider'
import { Wishlist } from '../Store/WishlistContextProvider'
import { useNavigate, useParams } from 'react-router-dom'
export default function SingleProductPage() {
    var [product, setproduct] = useState({})
    var { getSingle } = useContext(ProductContext)
    var { addCart,getCart } = useContext(Cart)
    var { addWishlist,getWishlist } = useContext(Wishlist)
    var { _id } = useParams()
    var navigate = useNavigate()
    async function getAPIData() {
        var item = {
            _id: _id
        }
        const response = await getSingle(item)
        if(response.result==="Done")
        setproduct(response.data)
        else{
            alert(response.message)
        }
    }
    function Item(props) {
        return (
            <Paper>
                {
                    props.item.pic ?
                        <img src={`/uploads/${props.item.pic}`} width="100%" height="500px" alt="" />
                        : ""
                }
            </Paper>
        )
    }
    var items = [
        {
            pic: product.pic1
        },
        {
            pic: product.pic2
        },
        {
            pic: product.pic3
        },
        {
            pic: product.pic4
        }
    ]
    async function addToCart(){
        let response = await getCart()
        var cart = response.data.find((item)=>item.productid===_id)
        if(cart === undefined){
            var item = {
                userid:localStorage.getItem("userid"),
                productid:_id,
                name:product.name,
                maincategory:product.maincategory,
                subcategory:product.subcategory,
                brand:product.brand,
                color:product.color,
                size:product.size,
                price:product.finalprice,
                qty:1,
                total:product.finalprice,
                pic:product.pic1
            }
            response = await addCart(item)
            if(response.result==="Fail")
            alert(response.message)
            else
            navigate("/cart")  
        }
        else
        navigate("/cart")
    }
    async function addToWishlist(){
        let response = await getWishlist()
        var wishlist = response.data.find((item)=>item.productid===_id)
        if(wishlist === undefined){
            var item = {
                userid:localStorage.getItem("userid"),
                productid:_id,
                name:product.name,
                maincategory:product.maincategory,
                subcategory:product.subcategory,
                brand:product.brand,
                color:product.color,
                size:product.size,
                price:product.finalprice,
                pic:product.pic1
            }
            response = await addWishlist(item)
            if(response.result==="Fail")
            alert(response.message)
            else
            navigate("/profile")            
        }
        else
        navigate("/profile")
    }
    useEffect(() => {
        getAPIData()
    },[])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <Carousel>
                        {
                            items.map((item, i) => <Item key={i} item={item} />)
                        }
                    </Carousel>
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-2'>Single Product Section</h5>
                    <div className="table-responsive">
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{product.name}</td>
                                </tr>
                                <tr>
                                    <th>Maincategory</th>
                                    <td>{product.maincategory}</td>
                                </tr>
                                <tr>
                                    <th>subcategory</th>
                                    <td>{product.subcategory}</td>
                                </tr>
                                <tr>
                                    <th>Brand</th>
                                    <td>{product.brand}</td>
                                </tr>
                                <tr>
                                    <th>Color</th>
                                    <td>{product.color}</td>
                                </tr>
                                <tr>
                                    <th>Size</th>
                                    <td>{product.size}</td>
                                </tr>
                                <tr>
                                    <th>Base Price</th>
                                    <td>&#8377;<del className='text-danger'>{product.baseprice}</del></td>
                                </tr>
                                <tr>
                                    <th>Discount</th>
                                    <td>{product.discount}%</td>
                                </tr>
                                <tr>
                                    <th>Final Price</th>
                                    <td>&#8377;{product.finalprice}</td>
                                </tr>
                                <tr>
                                    <th>Stock</th>
                                    <td>{product.stock}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{product.description}</td>
                                </tr>
                                <tr>
                                    <th colSpan={2}><button onClick={addToCart} className='mybtn text-decoration-none text-center d-block w-100 background text-light p-1 rounded'>Add to Cart</button></th>
                                </tr>
                                <tr>
                                    <th colSpan={2}><button onClick={addToWishlist} className='mybtn text-decoration-none text-center d-block w-100 background text-light p-1 rounded'>Add to Wishlist</button></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
