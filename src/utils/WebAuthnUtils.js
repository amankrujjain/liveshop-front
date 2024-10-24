import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import toast from 'react-hot-toast';

const backendUrl = process.env.NODE_ENV === "production" ? "https://liveshop-back.onrender.com" : 'http://localhost:8000';


// Function to start WebAuthn Registration

export async function startWebAuthnRegistration(username) {
    try {
        if (!username) {
            toast.error("Username is missing or incorrect.");
        }

        // Call the backend API to get registration options
        const response = await fetch(`${backendUrl}/register-webauthn/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
            credentials: "include", // Include cookies
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Error response from server:", errorBody);
            throw new Error("An error occurred while registering the user.");
        }

        const { options, sessionID } = await response.json();

        // Store session in sessionStorage instead of localStorage
        sessionStorage.setItem("SessionID", sessionID);
        console.log("WebAuthn options received for registration:", options);

        // Start WebAuthn registration
        const credential = await startRegistration(options);

        console.log("Credentials created in WebAuthn utils:", credential);

        // Prepare the attestation response to be sent back to the backend
        const attestationResponse = {
            id: credential.id,
            rawId: credential.rawId,  // Raw array buffer
            response: {
                clientDataJSON: credential.response.clientDataJSON,  // Raw array buffer
                attestationObject: credential.response.attestationObject,  // Raw array buffer
            },
            type: credential.type,
        };

        console.log("Attestation Response to be sent:", attestationResponse);

        return attestationResponse;
    } catch (error) {
        if (error.name === 'InvalidStateError') {
            console.error("Authenticator was probably already registered by the user.");
        } else {
            console.error("WebAuthN Registration Error:", error.message);
        }
        throw error;
    }
}

// Function to verify WebAuthn Registration
export async function verifyWebAuthnRegistration(username, credential) {
    try {
        console.log("Verification API details, username:", username);
        console.log("Verification API details, raw credentials:", credential);

        const sessionID = sessionStorage.getItem('SessionID');
        if (!sessionID) {
            throw new Error("Session ID missing. Registration might not have been initiated correctly.");
        }
        console.log("SessionID", sessionID);

        // Send the attestation response to the backend
        const response = await fetch(`${backendUrl}/register-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionID,
                username,
                attestationResponse: {
                    id: credential.id,
                    rawId: credential.rawId,
                    response: {
                        clientDataJSON: credential.response.clientDataJSON,
                        attestationObject: credential.response.attestationObject,
                    },
                    type: credential.type,
                },
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Failed to verify WebAuthN registration, response:', errorResponse);
            throw new Error('Failed to verify WebAuthN registration.');
        }

        // Clear session ID after successful verification
        sessionStorage.removeItem("SessionID");

        return await response.json();
    } catch (error) {
        console.error("WebAuthN Registration Verification Error:", error);
        throw error;
    }
}
// Function to start WebAuthn Login
// Function to start WebAuthn Login
export async function startWebAuthnLogin(username) {
    try {
        // Retrieve sessionID from sessionStorage (or localStorage if preferred)
        const sessionID = sessionStorage.getItem("SessionID");

        if (!sessionID) {
            throw new Error("Session ID is missing. Please start the login process first.");
        }

        // Call the backend to get login (authentication) options
        const response = await fetch(`${backendUrl}/webauthn/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, sessionID }),  // Send session ID with username
            credentials: "include", // Include cookies
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Error response from server:", errorBody);
            throw new Error("An error occurred during login.");
        }

        const { options } = await response.json();

        console.log("WebAuthn options received for login:", options);

        // Start WebAuthn authentication (browser will prompt for biometrics, etc.)
        const assertion = await startAuthentication(options);

        console.log("Assertion created in WebAuthn:", assertion);

        return assertion;  // Return the assertion for verification
    } catch (error) {
        console.error("WebAuthN Login Error:", error);
        throw error;
    }
}

// Function to verify WebAuthn Login (Authentication Verification)
export async function verifyWebAuthnLogin(username, authResponse) {
    try {
        console.log("Login Verification API details, username:", username);
        console.log("Login Verification API details, raw authResponse:", authResponse);

        const sessionID = sessionStorage.getItem("SessionID");

        if (!sessionID) {
            throw new Error("Session ID is missing. Please start the login process first.");
        }

        // Send the authentication response to the backend without any frontend encoding
        const response = await fetch(`${backendUrl}/login-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Send credentials
            body: JSON.stringify({
                username,
                authResponse,  // Send the assertion (authResponse)
                sessionID,  // Include sessionID from sessionStorage
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Failed to verify WebAuthN login, response:', errorResponse);
            throw new Error('Failed to verify WebAuthN login.');
        }

        // Clear session ID after successful login verification
        sessionStorage.removeItem("SessionID");

        return await response.json();  // Return response from server (e.g., token, user info)
    } catch (error) {
        console.error("WebAuthN Login Verification Error:", error);
        throw error;
    }
}
