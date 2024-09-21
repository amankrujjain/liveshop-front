import React, { createContext } from "react"

export const Brand = createContext()
async function addBrand(item) {
    var rawdata = await fetch("/brand", {
        method: "post",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function updateBrand(item) {
    var rawdata = await fetch("/brand/" + item._id, {
        method: "put",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body: JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getBrand() {
    var rawdata = await fetch("/brand",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleBrand(item) {
    var rawdata = await fetch("/brand/" + item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteBrand(item) {
    var rawdata = await fetch("/brand/" + item._id, {
        method: "delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
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