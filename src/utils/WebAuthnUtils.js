// Utility function to decode base64 to array buffer
function bufferDecode(value) {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

// Utility function to encode array buffer to base64
function bufferEncode(value) {
    return btoa(String.fromCharCode(...new Uint8Array(value)));
}

// Function to start WebAuthn Registration
export async function startWebAuthnRegistration(options) {
    try {
        options.user.id = bufferDecode(options.user.id);
        options.challenge = bufferDecode(options.challenge);

        // WebAuthn registration request using navigator.credentials.create
        const credential = await navigator.credentials.create({
            publicKey: options,
        });

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

        return attestationResponse;
    } catch (error) {
        console.error("WebAuthN Registration Error:", error);
        throw error;
    }
}

// Function to verify WebAuthn registration
export async function verifyWebAuthnRegistration(username, credential) {
    try {
        // Send the attestation response to the server for verification
        const response = await fetch('/register-webauthn/verify', {
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
