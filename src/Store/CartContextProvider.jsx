import React,{createContext} from "react"

export const Cart = createContext()
async function addCart(item){
    var rawdata = await fetch("/cart",{
        method:"post",
        headers:{
            "content-type":"application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function updateCart(item){
    var rawdata = await fetch("/cart/"+item.id,{
        method:"put",
        headers:{
            "content-type":"application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getCart(item){
    var rawdata = await fetch("/cartUser/"+localStorage.getItem("userid"),{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleCart(item){
    var rawdata = await fetch("/cart/"+item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteCart(item){
    var rawdata = await fetch("/cart/"+item._id,{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteAllCart(){
    var rawdata = await fetch("/cartall/"+localStorage.getItem("userid"),{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function CartContextProvider(props){
    return <Cart.Provider value={
            {
                addCart:addCart,
                getCart:getCart,
                deleteData:deleteCart,
                getSingle:getSingleCart,
                update:updateCart,
                deleteAll:deleteAllCart
            }
        }>
        {props.children}
    </Cart.Provider>
}