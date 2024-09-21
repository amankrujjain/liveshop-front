import React, { useEffect, useState } from 'react';
import { startWebAuthnRegistration, verifyWebAuthnRegistration } from '../utils/WebAuthnUtils';

export default function RegisterDevice({ username }) {
    const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false);

    useEffect(() => {
        if (window.PublicKeyCredential) {
            setIsWebAuthnSupported(true);
        }
    }, []);

    async function registerDevice() {
        if (isWebAuthnSupported) {
            try {
                // Request WebAuthn options from the server
                const webAuthnOptions = await fetch('/register-webauthn/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                }).then(res => res.json());

                if (webAuthnOptions.error) {
                    throw new Error(webAuthnOptions.error);
                }

                // Start WebAuthn registration (trigger fingerprint/biometric prompt)
                const credential = await startWebAuthnRegistration(webAuthnOptions);

                // Verify the registration with the backend
                const verifyResponse = await fetch('/register-webauthn/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        attestationResponse: credential
                    })
                }).then(res => res.json());

                if (verifyResponse.result === "Done") {
                    alert("Device successfully registered!");
                } else {
                    alert("Device registration failed.");
                }
            } catch (error) {
                console.error("Error during WebAuthN process:", error);
                alert("WebAuthN setup could not be initiated.");
            }
        } else {
            alert("WebAuthN is not supported on this device.");
        }
    }

    return (
        <div>
            {isWebAuthnSupported ? (
                <button onClick={registerDevice}>Register Your Device</button>
            ) : (
                <p>WebAuthN is not supported on this device.</p>
            )}
        </div>
    );
}
