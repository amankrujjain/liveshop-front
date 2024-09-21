import React, { useState, useContext, useEffect } from 'react'

import LeftNav from './LeftNav'

import { useParams, useNavigate } from 'react-router-dom'
import { Product } from '../../Store/ProductContextProvider'
import { Maincategory } from '../../Store/MaincategoryContextProvider'
import { Subcategory } from '../../Store/SubcategoryContextProvider'
import { Brand } from '../../Store/BrandContextProvider'
export default function AdminUpdateProduct() {
    var [product, setproduct] = useState({
        name: "",
        maincategory: "",
        subcategory: "",
        brand: "",
        color: "",
        size: "",
        baseprice: 0,
        discount: 0,
        finalprice: 0,
        stock: "In Stock",
        description: "This is Sample Product",
        pic1: "",
        pic2: "",
        pic3: "",
        pic4: ""
    })
    var { _id } = useParams()
    var [maincategory, setmaincategory] = useState([])
    var [subcategory, setsubcategory] = useState([])
    var [brand, setbrand] = useState([])
    var { update, getSingle } = useContext(Product)
    var { getMaincategory } = useContext(Maincategory)
    var { getSubcategory } = useContext(Subcategory)
    var { getBrand } = useContext(Brand)
    var navigate = useNavigate()
    function getData(e) {
        var name = e.target.name
        var value = e.target.value
        setproduct((oldData) => {
            return {
                ...oldData,
                [name]: value
            }
        })
    }
    function getFile(e) {
        var name = e.target.name
        var value = e.target.files[0].name
        setproduct((oldData) => {
            return {
                ...oldData,
                [name]: value
            }
        })
    }
    async function postData(e) {
        e.preventDefault()
        var fp = product.baseprice-product.baseprice*product.discount/100
        var item = new FormData()
        item.append('name',product.name)
        item.append('maincategory', product.maincategory)
        item.append('subcategory', product.subcategory)
        item.append('brand', product.brand)
        item.append('color', product.color)
        item.append('size', product.size)
        item.append('stock', product.stock)
        item.append('description', product.description)
        item.append('baseprice', product.baseprice)
        item.append('discount', product.discount)
        item.append('finalprice', fp)
        item.append('pic1', product.pic1)
        item.append('pic2', product.pic2)
        item.append('pic3', product.pic3)
        item.append('pic4', product.pic4)
        const response = await update(item,_id)
        if (response.result === "Done")
            navigate("/admin-product")
        else
            alert(response.message)
    }
    async function getAPIData() {
        var item = {
            _id: _id
        }
        var presponse = await getSingle(item)
        if (presponse.result === "Done") {
            setproduct(presponse.data)
        }
        else
            alert(presponse.message)


        var response = await getMaincategory()
        var items = response.data.filter((item) => item.name !== presponse.data.maincategory)
        if (response.result === "Done") {
            setmaincategory(items)
        }
        else
            alert(response.message)

        response = await getSubcategory()
        items = response.data.filter((item) => item.name !== presponse.data.subcategory)
        if (response.result === "Done") {
            setsubcategory(items)
        }
        else
            alert(response.message)

        response = await getBrand()
        items = response.data.filter((item)=>item.name!==presponse.data.brand)
        if (response.result === "Done") {
            setbrand(items)
        }
        else
            alert(response.message)

    }
    useEffect(() => {
        getAPIData()
    },[])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
                    <LeftNav />
                </div>
                <div className='col-lg-10 col-md-8 col-sm-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Product Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" onChange={getData} placeholder='Enter Product Name : ' value={product.name} />
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Maincategory</label>
                                <select name="maincategory" onChange={getData} className="form-select">
                                    <option value={product.maincategory}>{product.maincategory}</option>
                                    {
                                        maincategory.map((item, index) => {
                                            return <option key={index} value={item.value}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Subcategory</label>
                                <select name="subcategory" onChange={getData} className="form-select">
                                    <option value={product.subcategory}>{product.subcategory}</option>
                                    {
                                        subcategory.map((item, index) => {
                                            return <option key={index} value={item.value}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Brand</label>
                                <select name="brand" onChange={getData} className="form-select">
                                    <option value={product.brand}>{product.brand}</option>
                                    {
                                        brand.map((item, index) => {
                                            return <option key={index} value={item.value}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Stock</label>
                                <select name="stock" onChange={getData} className="form-select">
                                    {
                                        product.stock === "In Stock" ? <>
                                            <option value="In Stock">In Stock</option>
                                            <option value="Out Stock">Out Stock</option>
                                        </> : <>
                                            <option value="Out Stock">Out Stock</option>
                                            <option value="In Stock">In Stock</option>
                                        </>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Color</label>
                                <input type="text" className="form-control" name="color" onChange={getData} placeholder='Enter Product Color : ' value={product.color} />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Size</label>
                                <input type="text" className="form-control" name="size" onChange={getData} placeholder='Enter Product Size : ' value={product.size} />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Base Price</label>
                                <input type="number" className="form-control" name="baseprice" onChange={getData} placeholder='Enter Base Price : ' value={product.baseprice} />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Discount</label>
                                <input type="number" className="form-control" name="discount" onChange={getData} placeholder='Enter Discount : ' min={0} value={product.discount} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="description" onChange={getData} rows={5} className="form-control" value={product.description}></textarea>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic1</label>
                                <input type="file" className="form-control" name="pic1" onChange={getFile} />
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic2</label>
                                <input type="file" className="form-control" name="pic2" onChange={getFile} />
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic3</label>
                                <input type="file" className="form-control" name="pic3" onChange={getFile} />
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic4</label>
                                <input type="file" className="form-control" name="pic4" onChange={getFile} />
                            </div>
                        </div>
                        <button type="submit" className="border-0 p-1 background text-light btn-sm w-100">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
