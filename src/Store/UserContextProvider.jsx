import React, { createContext } from "react";
const backendUrl ="https://liveshop-back.onrender.com"; 

export const User = createContext();
async function login(item) {
  var rawdata = await fetch(`${backendUrl}/login`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(item),
    credentials: "include",
  });
  console.log("Raw data after login,",rawdata)
  return await rawdata.json();
}
async function addUser(item) {
  try {
    const rawdata = await fetch(`${backendUrl}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      credentials: "include",
    });

    if(!rawdata.ok){
      throw new Error(`Failed to add user. Server return status ${rawdata.status}`)
    };

    const data = await rawdata.json();
    return data;
  } catch (error) {
    console.error("Error adding user:", error);
    return { result: "Fail", message: error.message };
  }
}


async function updateUser(item) {
  try {
    const userID = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const rawdata = await fetch(`${backendUrl}/user/${userID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        username: username,
      },
      body: item,
      credentials: "include",
    });

    if (!rawdata.ok) {
      throw new Error(`Error: ${rawdata.status} - ${rawdata.statusText}`);
    }

    return await rawdata.json();
  } catch (error) {
    console.error("Update User Error:", error.message);
    return { error: error.message };
  }
}

async function getUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    throw new Error("Missing token or username");
  }

  const rawdata = await fetch(`${backendUrl}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Prefix with Bearer
      username: username,
    },
    credentials: "include",
  });

  if (!rawdata.ok) {
    throw new Error("Unauthorized: Invalid or missing token");
  }

  return await rawdata.json();
}

async function getSingleUser() {
  try {
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    // Check if userId or token is missing
    if (!userId || !token) {
      throw new Error("Missing user ID or authentication token");
    }

    const response = await fetch(`${backendUrl}/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add 'Bearer ' prefix to the token
        username: username,
      },
      credentials: "include",
    });

    // Handle non-200 responses
    if (!response.ok) {
      // Check for specific status codes and return meaningful errors
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or missing token");
      } else if (response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }

    // Parse the response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Log and return the error message
    console.error("Error while fetching the user:", error.message);
    return { error: error.message };
  }
}

async function deleteUser(item) {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      throw new Error("Missing token or username");
    }

    var rawdata = await fetch(`${backendUrl}/user/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
      credentials: "include",
    });
    if (!rawdata.ok) {
      throw new Error("Unauthorized: Invalid token or missing token");
    }
    return await rawdata.json();
  } catch (error) {
    console.log("Error while deteling newslatter:", error);
    return { error: error.message };
  }
}


export default function UserContextProvider(props) {
  return (
    <User.Provider
      value={{
        login: login,
        add: addUser,
        getUser: getUser,
        deleteData: deleteUser,
        getSingle: getSingleUser,
        update: updateUser,

      }}
    >
      {props.children}
    </User.Provider>
  );
}
