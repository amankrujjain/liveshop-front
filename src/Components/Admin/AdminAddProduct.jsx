import React, { useState, useContext, useEffect } from 'react'

import LeftNav from './LeftNav'

import { useNavigate } from 'react-router-dom'
import { Product } from '../../Store/ProductContextProvider'
import { Maincategory } from '../../Store/MaincategoryContextProvider'
import { Subcategory } from '../../Store/SubcategoryContextProvider'
import { Brand } from '../../Store/BrandContextProvider'
export default function AdminAddProduct() {
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
    var [maincategory, setmaincategory] = useState([])
    var [subcategory, setsubcategory] = useState([])
    var [brand, setbrand] = useState([])
    var { add } = useContext(Product)
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
        var value = e.target.files[0]
        setproduct((oldData) => {
            return {
                ...oldData,
                [name]: value
            }
        })
    }
    async function postData(e) {
        e.preventDefault();
        try {
            // Calculate final price
            const fp = product.baseprice - product.baseprice * product.discount / 100;
    
            // Create FormData object and append fields
            const item = new FormData();
            item.append('name', product.name);
            item.append('maincategory', product.maincategory);
            item.append('subcategory', product.subcategory);
            item.append('brand', product.brand);  // Fixed: should append `brand` instead of `name`
            item.append('color', product.color);
            item.append('size', product.size);
            item.append('stock', product.stock);
            item.append('description', product.description);
            item.append('baseprice', product.baseprice);
            item.append('discount', product.discount);
            item.append('finalprice', fp);
    
            // Append files only if they exist
            if (product.pic1) item.append('pic1', product.pic1);
            if (product.pic2) item.append('pic2', product.pic2);
            if (product.pic3) item.append('pic3', product.pic3);
            if (product.pic4) item.append('pic4', product.pic4);
    
            // Send FormData to the backend
            const response = await add(item);
    
            // Check response status before proceeding
            if (response.result === "Done") {
                navigate("/admin-product");
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error("Error during product creation:", error);
            alert("Something went wrong. Please try again.");
        }
    }
    
    async function getAPIData() {
        var response = await getMaincategory()
        if (response.result === "Done") {
            setmaincategory(response.data)
            setproduct((oldData) => {
                return {
                    ...oldData,
                    maincategory: response.data[0].name
                }
            })
        }
        else
            alert(response.message)

        response = await getSubcategory()
        if (response.result === "Done") {
            setsubcategory(response.data)
            setproduct((oldData) => {
                return {
                    ...oldData,
                    subcategory: response.data[0].name
                }
            })
        }
        else
            alert(response.message)

        response = await getBrand()
        if (response.result === "Done") {
            setbrand(response.data)
            setproduct((oldData) => {
                return {
                    ...oldData,
                    brand: response.data[0].name
                }
            })
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
                <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
                    <LeftNav />
                </div>
                <div className='col-lg-10 col-md-8 col-sm-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Product Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" onChange={getData} required placeholder='Enter Product Name : ' />
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Maincategory</label>
                                <select name="maincategory" onChange={getData} className="form-select" value={product.maincategory}>
                                    {
                                        maincategory.map((item, index) => (
                                            <option key={index} value={item.name}>{item.name}</option> // Use item.name for value
                                        ))
                                    }
                                </select>

                                <select name="subcategory" onChange={getData} className="form-select" value={product.subcategory}>
                                    {
                                        subcategory.map((item, index) => (
                                            <option key={index} value={item.name}>{item.name}</option> // Use item.name for value
                                        ))
                                    }
                                </select>

                                <select name="brand" onChange={getData} className="form-select" value={product.brand}>
                                    {
                                        brand.map((item, index) => (
                                            <option key={index} value={item.name}>{item.name}</option> // Use item.name for value
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Stock</label>
                                <select name="stock" onChange={getData} className="form-select">
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out Stock">Out Stock</option>
                                </select>
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Color</label>
                                <input type="text" className="form-control" name="color" onChange={getData} required placeholder='Enter Product Color : ' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Size</label>
                                <input type="text" className="form-control" name="size" onChange={getData} required placeholder='Enter Product Size : ' />
                            </div>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Base Price</label>
                                <input type="number" className="form-control" name="baseprice" onChange={getData} required placeholder='Enter Base Price : ' />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Discount</label>
                                <input type="number" className="form-control" name="discount" onChange={getData} required placeholder='Enter Discount : ' min={0} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="description" onChange={getData} rows={5} className="form-control" value={product.description}></textarea>
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic1</label>
                                <input type="file" className="form-control" name="pic1" onChange={getFile} required />
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic2</label>
                                <input type="file" className="form-control" name="pic2" onChange={getFile} required />
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic3</label>
                                <input type="file" className="form-control" name="pic3" onChange={getFile} required />
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                                <label className="form-label">Pic4</label>
                                <input type="file" className="form-control" name="pic4" onChange={getFile} required />
                            </div>
                        </div>
                        <button type="submit" className="border-0 p-1 background text-light btn-sm w-100">Add</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
