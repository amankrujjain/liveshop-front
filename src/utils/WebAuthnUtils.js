import { startRegistration } from '@simplewebauthn/browser';

const backendUrl = process.env.NODE_ENV === "production" ? "https://liveshop-back.onrender.com" : 'http://localhost:8000';


function conversion(value) {
    // Regular expression to check if the value is base64url (only characters A-Z, a-z, 0-9, -, _)
    const base64urlRegex = /^[A-Za-z0-9\-_]+$/;

    if (base64urlRegex.test(value)) {
        console.log("Decoding base64url to Uint8Array...");
        // Decode base64url string into ArrayBuffer/Uint8Array
        const decodedStr = atob(value.replace(/-/g, '+').replace(/_/g, '/')); // Base64url decoding
        return Uint8Array.from(decodedStr, char => char.charCodeAt(0)); // Convert each character to byte (Uint8Array)
    } else {
        console.log("Converting regular string to Uint8Array...");
        const encoder = new TextEncoder();
        return encoder.encode(value); // Convert regular string to Uint8Array
    }
}



function bufferEncode(value) {
    if (!value) {
        return '';
    }
    return btoa(String.fromCharCode(...new Uint8Array(value)));
}



// Function to start WebAuthn Registration

export async function startWebAuthnRegistration(username) {
    try {
        if (!username) {
            throw new Error("Username is missing or incorrect.");
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

        const webAuthnOptions = await response.json();

        // Start WebAuthn registration without any further encoding on the frontend
        const credential = await startRegistration(webAuthnOptions);

        console.log("Credentials created in WebAuthn utils:", credential);

        // Prepare the attestation response to be sent back to the backend
        // No encoding is done here, raw data is passed as-is
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
            console.error("Authenticator was probably already registered by the user");
        } else {
            console.error("WebAuthN Registration Error:", error.message);
        }
        throw error;
    }
}

export async function verifyWebAuthnRegistration(username, credential) {
    try {
        console.log("Verification API details, username:", username);
        console.log("Verification API details, raw credentials:", credential);

        // Send the attestation response to the backend without any frontend encoding
        const response = await fetch(`${backendUrl}/register-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                attestationResponse: {
                    id: credential.id,  // Already a string
                    rawId: credential.rawId,  // Already a base64URL string
                    response: {
                        clientDataJSON: credential.response.clientDataJSON,  // Already a base64URL string
                        attestationObject: credential.response.attestationObject,  // Already a base64URL string
                    },
                    type: credential.type,  // No conversion needed, pass as-is
                },
            }),
        });

        console.log("Response sent to backend:", response);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Failed to verify WebAuthN registration, response:', errorResponse);
            throw new Error('Failed to verify WebAuthN registration.');
        }

        return await response.json();
    } catch (error) {
        console.error("WebAuthN Registration Verification Error:", error);
        throw error;
    }
}

// Function to start WebAuthn Login
export async function startWebAuthnLogin(options) {
    try {
        options.challenge = conversion(options.challenge);

        if (options.allowCredentials) {
            options.allowCredentials = options.allowCredentials.map((cred) => ({
                ...cred,
                id: conversion(cred.id),
            }));
        }

        // WebAuthn login request using navigator.credentials.get
        const assertion = await navigator.credentials.get({
            publicKey: options,
        });

        // Prepare authentication response to be sent back to the backend
        const authResponse = {
            id: assertion.id,
            rawId: bufferEncode(assertion.rawId),
            response: {
                clientDataJSON: bufferEncode(assertion.response.clientDataJSON),
                authenticatorData: bufferEncode(assertion.response.authenticatorData),
                signature: bufferEncode(assertion.response.signature),
                userHandle: bufferEncode(assertion.response.userHandle),
            },
            type: assertion.type,
        };

        return authResponse;
    } catch (error) {
        console.error("WebAuthN Login Error:", error);
        throw error;
    }
}
