import React, { createContext } from "react";

export const Checkout = createContext();
async function addCheckout(item) {
  var rawdata = await fetch("/checkout", {
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
async function updateCheckout() {
  try {
    const userID = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!userID || !token) {
      throw new Error("Missing user ID or authentication token");
    }

    var response = await fetch(`/checkout/${userID}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or missing token");
      } else if (response.status === 404) {
        throw new Error("Wishlist not found");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching the wishlist:", error.message);
    return { error: error.message };
  }
}
async function getCheckout() {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      throw new Error("Missing token or username");
    }

    var rawdata = await fetch("/checkout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
    });
    if (!rawdata.ok) {
      throw new Error("Unauthorized: Invalid or missing token");
    }

    return await rawdata.json();
  } catch (error) {
    console.log("Error while getting checkout:", error);
    return {error: error.message}
  }
}
async function getCheckoutUser() {
  try {
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    // Check if userId or token is missing
    if (!userId || !token) {
      throw new Error("Missing user ID or authentication token");
    }

    const response = await fetch(`/checkoutUser/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add 'Bearer ' prefix to the token
        username: username,
      },
    });

    // Handle non-200 responses
    if (!response.ok) {
      // Check for specific status codes and return meaningful errors
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or missing token");
      } else if (response.status === 404) {
        throw new Error("No items found in checkout");
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
async function getSingleCheckout(item) {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    var response = await fetch(`/checkout/${item._id}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
        username: username,
      },
    });
    // Handle non-200 responses
    if (!response.ok) {
      // Check for specific status codes and return meaningful errors
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or missing token");
      } else if (response.status === 404) {
        throw new Error("No items found in checkout");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }
    return await response.json();
  } catch (error) {
    console.error("Error while fetching the user:", error.message);
    return { error: error.message };
  }
}
export default function CheckoutContextProvider(props) {
  return (
    <Checkout.Provider
      value={{
        add: addCheckout,
        getCheckout: getCheckout,
        getSingle: getSingleCheckout,
        update: updateCheckout,
        getCheckoutUser: getCheckoutUser,
      }}
    >
      {props.children}
    </Checkout.Provider>
  );
}
