import React,{createContext} from "react";
import toast from 'react-hot-toast'
const backendUrl = process.env.REACT_APP_LOCALHOST_URL;


export const Cart = createContext()

async function updateCart(item){
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");
    var rawdata = await fetch("/cart/"+item.id,{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "authorization":`Bearer ${token}`,
            "username":username
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getCart() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userid");

    try {
        const response = await fetch(`${backendUrl}/cart-item/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data: data.data }; // Extract products array from response
    } catch (error) {
        console.error("Error in getCart:", error);
        return { success: false, message: "Failed to fetch cart" };
    }
}

const addToCart = async (productId, quantity = 1) => {
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
  
    // Ensure `userId` and `productId` are valid
    if (!userId || !productId) {
      console.error("User ID or Product ID is missing");
      return { success: false, message: "User ID or Product ID is missing" };
    }
  
    try {
      console.log("Adding to cart:", { userId, productId, quantity });
  
      const response = await fetch(`${backendUrl}/add-to-cart/user/${userId}/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }), // Send quantity as a JSON body
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Cart updated successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error in addToCart:", error);
      return { success: false, message: error.message };
    }
  };
  
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
                addCart:addToCart,
                getCart:getCart,
                deleteData:deleteCart,
                update:updateCart,
                deleteAll:deleteAllCart
            }
        }>
        {props.children}
    </Cart.Provider>
}