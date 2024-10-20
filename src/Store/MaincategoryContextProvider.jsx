import React, { createContext } from "react";
const backendUrl = process.env.REACT_APP_LOCALHOST_URL;

console.log('env for production url', process.env.REACT_APP_PRODUCTION_BACKEND_URL);
console.log("backend url",process.env.REACT_APP_LOCALHOST_URL)

export const Maincategory = createContext();
async function addMaincategory(item) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Missing token");
    }

    const response = await fetch(`${backendUrl}/create-maincategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Corrected capitalization
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    console.log("Response status:", response);

    // Check if the response is JSON before parsing
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json(); // Parse JSON only if content-type is correct
    } else {
      data = await response.text(); // Handle non-JSON responses (like HTML errors)
      console.error("Expected JSON but received:", data);
      throw new Error("Non-JSON response received");
    }

    // Handle non-OK responses (like 401, 403, or 500)
    if (!response.ok) {
      console.log("Error Data from server ===>", data);
      throw new Error(data.message || "Something went wrong");
    }

    // If successful, return the parsed JSON data
    console.log("Maincategory created successfully:", data);
    return data;
  } catch (error) {
    console.log("Error occurred while creating maincategory:", error);
    return { error: error.message };
  }
}



async function updateMaincategory(item) {
  let token = localStorage.getItem("token")
  let username = localStorage.getItem('username');
  var rawdata = await fetch(`${backendUrl}/maincategory/${item._id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      username: username
    },
    body: JSON.stringify(item),
  });
  return await rawdata.json();
}
async function getMaincategory() {
  try {
    const response = await fetch(`${backendUrl}/get-maincategory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error fetching data:", errorData);
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Maincategory data:", data);
    return data;
  } catch (error) {
    console.error("Error occurred while fetching maincategory:", error);
    return { error: error.message };
  }
}

async function getSingleMaincategory(item) {
  const username = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  var rawdata = await fetch(`${backendUrl}/get-single-maincategory/${item._id}`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      username: username
    },
  });
  return await rawdata.json();
}
async function deleteMaincategory(item) {
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username")
  var rawdata = await fetch(`${backendUrl}/delete-maincategory/${item._id}`, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      username: username,
    },
  });
  return await rawdata.json();
}
export default function MaincategoryContextProvider(props) {
  return (
    <Maincategory.Provider
      value={{
        add: addMaincategory,
        getMaincategory: getMaincategory,
        deleteData: deleteMaincategory,
        getSingle: getSingleMaincategory,
        update: updateMaincategory,
      }}
    >
      {props.children}
    </Maincategory.Provider>
  );
}
