import React, { createContext } from "react"
const backendUrl = process.env.REACT_APP_LOCALHOST_URL;
export const Subcategory = createContext()
async function addSubcategory(item) {
  try {
    const token = localStorage.getItem("token");

    // Check if the token exists
    if (!token) {
      throw new Error("Authorization token is missing. Please log in.");
    }

    // Make the API request
    const response = await fetch(`${backendUrl}/create-subcategory`, {
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

async function updateSubcategory(item) {
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username")
  var rawdata = await fetch(`${backendUrl}/update-subcategory/${item._id}`, {
    method: "put",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`,
      "username": username
    },
    body: JSON.stringify(item)
  })
  return await rawdata.json()
}
async function getSubcategory() {
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username")
  var rawdata = await fetch(`${backendUrl}/get-all-subcategory`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`,
      "username": username
    }
  })
  return await rawdata.json()
}
async function getSingleSubcategory(item) {
  var rawdata = await fetch(`${backendUrl}/get-single-subcategory/${item._id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "authorization": localStorage.getItem("token"),
      "username": localStorage.getItem("username")
    }
  })
  return await rawdata.json()
}
async function deleteSubcategory(item) {
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username")
  var rawdata = await fetch(`${backendUrl}/delete-subcategory/${item._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization":`Bearer ${token}`,
      "username": username
    }
  })
  return await rawdata.json()
}
export default function SubcategoryContextProvider(props) {
  return <Subcategory.Provider value={
    {
      add: addSubcategory,
      getSubcategory: getSubcategory,
      deleteData: deleteSubcategory,
      getSingle: getSingleSubcategory,
      update: updateSubcategory
    }
  }>
    {props.children}
  </Subcategory.Provider>
}