import React, { createContext } from "react";

export const Maincategory = createContext();
async function addMaincategory(item) {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if(!token || !username){
        throw new Error("Missing token or username");
    };

    var rawdata = await fetch("/maincategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
      body: JSON.stringify(item),
    });

    if(!rawdata.ok){
        throw new Error("Unauthorized: Invalid token or missing token");
    }

    return await rawdata.json();
  } catch (error) {
    console.log('Error occured while creating maincategory:',error);
    return {error: error.message}
  }
}
async function updateMaincategory(item) {
  var rawdata = await fetch("/maincategory/" + item._id, {
    method: "put",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
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
