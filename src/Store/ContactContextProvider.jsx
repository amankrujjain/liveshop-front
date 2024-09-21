import React, { createContext } from "react";

export const Contact = createContext();
async function addContact(item) {
  var rawdata = await fetch("/contact", {
    method: "post",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
    },
    body: JSON.stringify(item),
  });
  return await rawdata.json();
}
async function updateContact(item) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
  var rawdata = await fetch(`/contact/${item._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      username: username,
    },
    body: JSON.stringify(item),
  });
  return await rawdata.json();
}
async function getContact() {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      throw new Error("Missing token or username");
    }

    var response = await fetch("/contact", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized: Invalid or missing token");
    }
    return await response.json();
  } catch (error) {
    console.log("Error while getting contact:", error);
    return { error: error.message };
  }
}
async function getSingleContact(item) {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  var rawdata = await fetch(`/contact/${item._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      username: username,
    },
  });
  return await rawdata.json();
}
async function deleteContact(item) {
  var rawdata = await fetch("/contact/" + item._id, {
    method: "delete",
    headers: {
      "content-type": "application/json",
      authorization: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
    },
  });
  return await rawdata.json();
}
export default function ContactContextProvider(props) {
  return (
    <Contact.Provider
      value={{
        add: addContact,
        getContact: getContact,
        deleteData: deleteContact,
        getSingle: getSingleContact,
        update: updateContact,
      }}
    >
      {props.children}
    </Contact.Provider>
  );
}
