import React, { createContext } from "react";
const backendUrl = process.env.REACT_APP_LOCALHOST_URL;

export const Product = createContext()
async function addProduct(item) {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/create-product`, {
        method: "post",
        headers: {
            // "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "username": username
        },
        credentials: 'include',
        body:item
    })
    return await rawdata.json()
}
async function updateProduct(item, _id) {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");

    // Check for missing token
    if (!token) {
        console.error("No token found. Authorization is required.");
        return { result: "Fail", message: "Authorization token is missing. Please log in." };
    }

    try {
        const response = await fetch(`${backendUrl}/update-product/${_id}`, {
            method: "PUT",
            headers: {
                "authorization": `Bearer ${token}`,
                "username": username
            },
            body: item
        });

        // Handle non-200 response codes
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to update product:", response.status, errorData.message || response.statusText);
            return { result: "Fail", message: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        // Return response JSON if successful
        return await response.json();
    } catch (error) {
        // Catch any other errors that might occur during the fetch
        console.error("An error occurred while updating the product:", error);
        return { result: "Fail", message: "An unexpected error occurred. Please try again later." };
    }
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
    console.log(item)
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/get-single-product/${item._id}`,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":token,
            "username":username
        }
    })
    return await rawdata.json()
}
async function deleteProduct(item) {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/delete-product/${item._id}`, {

        method: "delete",
        headers: {
            "content-type": "application/json",
            "authorization":`Bearer ${token}`,
            "username":username
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