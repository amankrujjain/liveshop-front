import React, { createContext } from "react";

export const Newslatter = createContext();
async function addNewslatter(item) {
  var rawdata = await fetch("/newslatter", {
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
async function getNewslatter() {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      throw new Error("Misssing token or username");
    }

    var rawdata = await fetch("/newslatter", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
    });
    if (!rawdata.ok) {
      throw new Error("Unauthorized: Invalid ormissing token");
    }
    return await rawdata.json();
  } catch (error) {
    console.log("Error while fetching newslatter:", error);
    return { error: error.message };
  }
}
async function deleteNewslatter(item) {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if(!token || !username){
        throw new Error("Missing token or username");
    };

    var rawdata = await fetch(`/newslatter/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
    });

    if (!rawdata.ok) {
        throw new Error("Unauthorized: Invalid or missing token");
      };

    return await rawdata.json();
  } catch (error) {
    console.log("Error while deleting newslatter:", error);
    return { error: error.message };
  }
}
export default function NewslatterContextProvider(props) {
  return (
    <Newslatter.Provider
      value={{
        add: addNewslatter,
        getNewslatter: getNewslatter,
        deleteData: deleteNewslatter,
      }}
    >
      {props.children}
    </Newslatter.Provider>
  );
}
