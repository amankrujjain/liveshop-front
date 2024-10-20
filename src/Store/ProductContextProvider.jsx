import React, { createContext } from "react";
const backendUrl = process.env.REACT_APP_LOCALHOST_URL;

export const Product = createContext()
async function addProduct(item) {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/create-product`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "username": username
        },
        credentials: 'include',
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
async function getProduct() {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/get-all-product`,{
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "username": username
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