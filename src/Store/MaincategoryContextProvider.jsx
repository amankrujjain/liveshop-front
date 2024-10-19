import React, { createContext } from "react";
const backendUrl = 'http://localhost:8000';

console.log('env for production url', process.env.REACT_APP_PRODUCTION_BACKEND_URL);
console.log("backend url",backendUrl)

export const Maincategory = createContext();
async function addMaincategory(item) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Missing token");
    }

    const response = await fetch(`${backendUrl}/maincategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    console.log("Response status:", response.status);

    // Read the response body only once
    const data = await response.json();

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
  var rawdata = await fetch("/maincategory/" + item._id, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify(item),
  });
  return await rawdata.json();
}
async function getMaincategory(item) {
  var rawdata = await fetch("/maincategory", {
    method: "get",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
    },
  });
  return await rawdata.json();
}
async function getSingleMaincategory(item) {
  var rawdata = await fetch("/maincategory/" + item._id, {
    method: "get",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
    },
  });
  return await rawdata.json();
}
async function deleteMaincategory(item) {
  var rawdata = await fetch("/maincategory/" + item._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
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
