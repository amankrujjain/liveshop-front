import React,{createContext} from "react"

export const Wishlist = createContext()
async function addWishlist(item){
    var rawdata = await fetch("/wishlist",{
        method:"post",
        headers:{
            "content-type":"application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getWishlist() {
    try {
        const userID = localStorage.getItem('userid');
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        // Check if userID or token is missing
        if (!userID || !token) {
            throw new Error("Missing user ID or authentication token");
        }

        const response = await fetch(`/wishlist/${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "username": username
            }
        });

        // Handle non-200 responses
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized: Invalid or missing token");
            } else if (response.status === 404) {
                throw new Error("Wishlist not found");
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        }

        // Parse the response data
        const data = await response.json();
        return data;
    } catch (error) {
        // Log and return the error message
        console.error("Error while fetching the wishlist:", error.message);
        return { error: error.message };
    }
}

async function deleteWishlist(item){
    var rawdata = await fetch("/wishlist/"+item._id,{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function WishlistContextProvider(props){
    return <Wishlist.Provider value={
            {
                addWishlist:addWishlist,
                getWishlist:getWishlist,
                deleteData:deleteWishlist
            }
        }>
        {props.children}
    </Wishlist.Provider>
}