const backendUrl = process.env.NODE_ENV === "production" ? "https://liveshop-back.onrender.com" : 'http://localhost:8000';


function fromStringToUnit8Array(value) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(value);
    return uint8Array;
}

function bufferEncode(value) {
    if (!value) {
        console.error('No value passed to bufferEncode');
        return '';
    }

    // Check if the value is already encoded
    if (typeof value === 'string') {
        console.log('Value is already a string, no need to encode:', value);
        return value; // Already encoded string, no need to encode again
    }

    // Handle ArrayBuffer or Uint8Array
    if (value instanceof ArrayBuffer) {
        value = new Uint8Array(value); // Convert ArrayBuffer to Uint8Array
        console.log('Converting ArrayBuffer to Uint8Array:', value);
    }

    // Ensure the value is a Uint8Array
    if (value instanceof Uint8Array) {
        let binary = '';
        const len = value.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(value[i]); // Convert each byte to its string representation
        }
        console.log('Binary before Base64 encoding:', binary);
        return btoa(binary); // Base64 encode the binary string
    } else {
        console.error('Value is neither a string nor a Uint8Array:', value);
        return '';
    }
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

        // Check and convert user ID if necessary
        if (webAuthnOptions.user.id instanceof Uint8Array) {
            console.log("User ID is already a Uint8Array.");
        } else if (typeof webAuthnOptions.user.id === 'string') {
            console.log("User ID is in string format, converting to Uint8Array...");
            webAuthnOptions.user.id = fromStringToUnit8Array(webAuthnOptions.user.id);
        }

        // Check and convert challenge if necessary
        if (webAuthnOptions.challenge instanceof Uint8Array) {
            console.log("Challenge is already a Uint8Array.");
        } else if (typeof webAuthnOptions.challenge === 'string') {
            console.log("Challenge is in string format, converting to Uint8Array...");
            webAuthnOptions.challenge = fromStringToUnit8Array(webAuthnOptions.challenge);
        }

        console.log("WebAuthn registration options from server:", webAuthnOptions);

        // WebAuthn registration request using navigator.credentials.create
        const credential = await navigator.credentials.create({
            publicKey: webAuthnOptions,
        });

        console.log("Credentials created in WebAuthn utils:", credential);

        // Prepare attestation response to be sent back to the backend
        const attestationResponse = {
            id: credential.id,
            rawId: bufferEncode(credential.rawId), // Encode to Base64
            response: {
                clientDataJSON: bufferEncode(credential.response.clientDataJSON), // Encode to Base64
                attestationObject: bufferEncode(credential.response.attestationObject), // Encode to Base64
            },
            type: credential.type,
        };

        console.log("Attestation Response to be sent:", {
            username: username,
            attestationResponse: attestationResponse,
        });

        return attestationResponse;
    } catch (error) {
        console.error("WebAuthN Registration Error:", error.message);
        throw error;
    }
}


export async function verifyWebAuthnRegistration(username, credential) {
    try {
        console.log("Verification api details, username---->", username);
        console.log("Verification api details, raw credentials---->", credential);

        // // Check the rawId before encoding
        // console.log("Raw ID before encoding:", credential.rawId);
        // const encodedRawId = bufferEncode(credential.rawId);
        // console.log("Encoded Raw ID:", encodedRawId);

        // // Check clientDataJSON before encoding
        // console.log("clientDataJSON before encoding:", credential.response.clientDataJSON);
        // const encodedClientDataJSON = bufferEncode(credential.response.clientDataJSON);
        // console.log("Encoded clientDataJSON:", encodedClientDataJSON);

        // // Check attestationObject before encoding
        // console.log("attestationObject before encoding:", credential.response.attestationObject);
        // const encodedAttestationObject = bufferEncode(credential.response.attestationObject);
        // console.log("Encoded attestationObject:", encodedAttestationObject);

        // Send the attestation response to the server for verification
        const response = await fetch(`${backendUrl}/register-webauthn/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                attestationResponse: {
                    id: credential.id,
                    rawId: credential.rawId, // Encoded rawId
                    response: {
                        clientDataJSON: credential.response.clientDataJSON, // Encoded clientDataJSON
                        attestationObject: credential.response.attestationObject, // Encoded attestationObject
                    },
                    type: credential.type,
                },
            }),
        });

        console.log("Response sent to backend----->", response);

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
        options.challenge = fromStringToUnit8Array(options.challenge);

        if (options.allowCredentials) {
            options.allowCredentials = options.allowCredentials.map((cred) => ({
                ...cred,
                id: fromStringToUnit8Array(cred.id),
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
