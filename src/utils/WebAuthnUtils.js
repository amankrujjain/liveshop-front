const backendUrl =process.env.NODE_ENV==="production"?"https://liveshop-back.onrender.com":'http://localhost:8000'; 


function bufferDecode(value) {
    console.log("Value coming in the utils logic for decoding:", value);
    // Ensure padding is correct for Base64
    const paddingNeeded = 4 - (value.length % 4);
    const paddedValue = paddingNeeded === 4 ? value : value + "=".repeat(paddingNeeded);
    return Uint8Array.from(atob(paddedValue), c => c.charCodeAt(0));
}

// Utility function to encode array buffer to base64 (for sending back binary data as strings)
function bufferEncode(value) {
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
            credentials: "include",
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Error response from server:", errorBody);
            throw new Error("An error occurred while registering the user.");
        }

        const webAuthnOptions = await response.json();
        console.log("WebAuthn registration options from server:", webAuthnOptions);
        
        // If the ID and challenge are already binary (Uint8Array), no need to decode
        console.log("Checking if user ID and challenge are binary");

        if (webAuthnOptions.user.id instanceof Uint8Array) {
            console.log("User ID is already binary");
        } else if (typeof webAuthnOptions.user.id === 'string') {
            console.log("User ID is in string format, decoding...");
            webAuthnOptions.user.id = bufferDecode(webAuthnOptions.user.id);
        }

        if (webAuthnOptions.challenge instanceof Uint8Array) {
            console.log("Challenge is already binary");
        } else if (typeof webAuthnOptions.challenge === 'string') {
            console.log("Challenge is in string format, decoding...");
            webAuthnOptions.challenge = bufferDecode(webAuthnOptions.challenge);
        }

        // WebAuthn registration request using navigator.credentials.create
        const credential = await navigator.credentials.create({
            publicKey: webAuthnOptions,
        });

        console.log("Credentials in WebAuthn utils", credential);

        // Prepare attestation response to be sent back to the backend
        const attestationResponse = {
            id: credential.id,
            rawId: bufferEncode(credential.rawId),
            response: {
                clientDataJSON: bufferEncode(credential.response.clientDataJSON),
                attestationObject: bufferEncode(credential.response.attestationObject),
            },
            type: credential.type,
        };

        console.log("Attestation response", attestationResponse);

        return attestationResponse;
    } catch (error) {
        console.error("WebAuthN Registration Error:", error.message);
        throw error;
    }
}


// Function to verify WebAuthn registration
export async function verifyWebAuthnRegistration(username, credential) {
    try {
        // Send the attestation response to the server for verification
        const response = await fetch(`${backendUrl}/register-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                attestationResponse: {
                    id: credential.id,
                    rawId: bufferEncode(credential.rawId),
                    response: {
                        clientDataJSON: bufferEncode(credential.response.clientDataJSON),
                        attestationObject: bufferEncode(credential.response.attestationObject),
                    },
                    type: credential.type,
                },
            }),
        });

        if (!response.ok) {
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
        options.challenge = bufferDecode(options.challenge);

        if (options.allowCredentials) {
            options.allowCredentials = options.allowCredentials.map((cred) => ({
                ...cred,
                id: bufferDecode(cred.id),
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
