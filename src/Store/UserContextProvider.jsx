import React, { createContext } from "react";

export const User = createContext();
async function login(item) {
  var rawdata = await fetch("/login", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(item),
  });
  return await rawdata.json();
}
async function addUser(item) {
  var rawdata = await fetch("/user", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(item),
  });

  // Check if the response has a valid body
  if (rawdata.ok) {
    const contentType = rawdata.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await rawdata.json();
    } else {
      // Return an empty object if there's no JSON in the response
      return {};
    }
  } else {
    throw new Error("Failed to add user. Server returned " + rawdata.status);
  }
}

async function updateUser(item) {
  try {
    const userID = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const rawdata = await fetch(`/user/${userID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        username: username,
      },
      body: item, // Handle JSON or FormData
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

  const rawdata = await fetch("/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Prefix with Bearer
      username: username,
    },
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

    const response = await fetch(`/user/${userId}`, {
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

    var rawdata = await fetch(`/user/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        username: username,
      },
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

async function startWebAuthnRegistration(username) {
  try {
    if (!username) {
      throw new Error("Username is missing or incorrect.");
    }

    const response = await fetch("/register-webauthn/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      // Log the response body for better debugging in case of error
      const errorBody = await response.json();
      console.error("Error response from server:", errorBody);
      throw new Error("An error occurred while registering the user.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during WebAuthN registration start:", error.message);
    return { error: error.message };
  }
}

// WebAuthN Registration Verification
async function verifyWebAuthnRegistration(username, attestationResponse) {
  try {
    if (!username || !attestationResponse) {
      throw new Error(
        "Username or attestation response is missing, registration verification failed."
      );
    }

    const response = await fetch("/register-webauthn/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, attestationResponse }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error response from server:", errorBody);
      throw new Error("Failed to verify the registered user.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during WebAuthN registration verification:", error.message);
    return { error: error.message };
  }
}

// WebAuthN Login Start
async function startWebAuthnLogin(username) {
  try {
    if (!username) {
      throw new Error("Username is required for login.");
    }

    const response = await fetch("/webauthn/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error response from server:", errorBody);
      throw new Error("An error occurred during login initiation.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during WebAuthN login start:", error.message);
    return { error: error.message };
  }
}

// WebAuthN Login Verification
async function verifyWebAuthnLogin(username, authResponse) {
  try {
    if (!username || !authResponse) {
      throw new Error(
        "Username or authentication response is missing, verification failed."
      );
    }

    const response = await fetch("/login-webauthn/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, authResponse }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error response from server:", errorBody);
      throw new Error("WebAuthN login verification failed.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during WebAuthN login verification:", error.message);
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
        startWebAuthnRegisteration: startWebAuthnRegistration,
        verifyWebAuthnRegistration: verifyWebAuthnRegistration,
        startWebAuthnLogin: startWebAuthnLogin,
        verifyWebAuthnLogin: verifyWebAuthnLogin,
      }}
    >
      {props.children}
    </User.Provider>
  );
}
