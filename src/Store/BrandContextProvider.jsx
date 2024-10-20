import React, { createContext } from "react"
const backendUrl = process.env.REACT_APP_LOCALHOST_URL;

export const Brand = createContext()
async function addBrand(item) {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/create-brand`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "username": username
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function updateBrand(item) {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/update-brand/${item._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "username": username
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getBrand() {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/get-all-brand`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`,
            "username":username
        }
    })
    return await rawdata.json()
}
async function getSingleBrand(item) {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/get-single-brand/${item._id}`,{
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`,
            "username":username
        }
    })
    return await rawdata.json()
}
async function deleteBrand(item) {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem("username")
    var rawdata = await fetch(`${backendUrl}/delete-brand/${item._id}`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`,
            "username":username
        }
    })
    return await rawdata.json()
}
export default function BrandContextProvider(props) {
    return <Brand.Provider value={
        {
            add: addBrand,
            getBrand: getBrand,
            deleteData: deleteBrand,
            getSingle: getSingleBrand,
            update: updateBrand
        }
    }>
        {props.children}
    </Brand.Provider>
}