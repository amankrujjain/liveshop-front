import React, { createContext } from "react"

export const Product = createContext()
async function addProduct(item) {
    var rawdata = await fetch("/product", {
        method: "post",
        headers: {
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:item
    })
    return await rawdata.json()
}
async function updateProduct(item,_id) {
    
    var rawdata = await fetch("/product/" + _id, {
        method: "put",
        headers: {
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body: item
    })
    console.log(item._id);
    return await rawdata.json()
}
async function getProduct(item) {
    var rawdata = await fetch("/product",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleProduct(item) {
    var rawdata = await fetch("/product/" + item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteProduct(item) {
    var rawdata = await fetch("/product/" + item._id, {
        method: "delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function ProductContextProvider(props) {
    return <Product.Provider value={
        {
            add: addProduct,
            getProduct: getProduct,
            deleteData: deleteProduct,
            getSingle: getSingleProduct,
            update: updateProduct
        }
    }>
        {props.children}
    </Product.Provider>
}