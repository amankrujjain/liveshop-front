import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const backendUrl = process.env.NODE_ENV === "production" ? "https://liveshop-back.onrender.com" : 'http://localhost:8000';


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

        const {webAuthnOptions, sessionID} = await response.json();

        localStorage.setItem("SessionID", sessionID);
        
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

        const sessionID = localStorage.getItem('sessionID');
        if (!sessionID) {
            throw new Error("Session ID missing. Registration might not have been initiated correctly.");
        }
        // Send the attestation response to the backend without any frontend encoding
        const response = await fetch(`${backendUrl}/register-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
           
            body: JSON.stringify({
                sessionID:sessionID,
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
            credentials: 'include',
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
export async function startWebAuthnLogin(username) {
    try {
        // Call the backend to get login (authentication) options
        const response = await fetch(`${backendUrl}/webauthn/login`, {
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
            throw new Error("An error occurred during login.");
        }

        const webAuthnOptions = await response.json();

        // Start WebAuthn authentication
        const assertion = await startAuthentication(webAuthnOptions);

        console.log("Assertion created in WebAuthn:", assertion);


        return assertion;
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

        // Send the authentication response to the backend without any frontend encoding
        const response = await fetch(`${backendUrl}/login-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                authResponse:authResponse,
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Failed to verify WebAuthN login, response:', errorResponse);
            throw new Error('Failed to verify WebAuthN login.');
        }

        return await response.json();
    } catch (error) {
        console.error("WebAuthN Login Verification Error:", error);
        throw error;
    }
}