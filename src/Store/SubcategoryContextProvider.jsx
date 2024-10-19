import React,{createContext} from "react"
const backendUrl = 'http://localhost:8000';
export const Subcategory = createContext()
async function addSubcategory(item) {
    try {
      const token = localStorage.getItem("token");
  
      // Check if the token exists
      if (!token) {
        throw new Error("Authorization token is missing. Please log in.");
      }
  
      // Make the API request
      const response = await fetch(`${backendUrl}/subcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
  
      // Check if the response is successful
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorData = contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();
        console.log("Error from server:", errorData);
        throw new Error(errorData.message || "Failed to create subcategory");
      }
  
      // If the response is successful, return the JSON data
      const data = contentType && contentType.includes("application/json")
        ? await response.json()
        : null;
  
      console.log("Subcategory created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error occurred while creating subcategory:", error);
      return { error: error.message };
    }
  }
  
async function updateSubcategory(item){
    var rawdata = await fetch("/subcategory/"+item._id,{
        method:"put",
        headers:{
            "content-type":"application/json",
            "authorization": localStorage.getItem("token"),
            "username": localStorage.getItem("username")
        },
        body:JSON.stringify(item)
    })
    return await rawdata.json()
}
async function getSubcategory(item){
    var rawdata = await fetch("/subcategory",{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function getSingleSubcategory(item){
    var rawdata = await fetch("/subcategory/"+item._id,{
        method: "get",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
async function deleteSubcategory(item){
    var rawdata = await fetch("/subcategory/"+item._id,{
        method:"delete",
        headers: {
            "content-type": "application/json",
            "authorization":localStorage.getItem("token"),
            "username":localStorage.getItem("username")
        }
    })
    return await rawdata.json()
}
export default function SubcategoryContextProvider(props){
    return <Subcategory.Provider value={
            {
                add:addSubcategory,
                getSubcategory:getSubcategory,
                deleteData:deleteSubcategory,
                getSingle:getSingleSubcategory,
                update:updateSubcategory
            }
        }>
        {props.children}
    </Subcategory.Provider>
}