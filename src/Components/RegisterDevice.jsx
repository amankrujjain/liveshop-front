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
                // Start WebAuthn registration (trigger fingerprint/biometric prompt)
                const webAuthnOptions = await startWebAuthnRegistration({ username });

                // Verify the registration with the backend
                const verifyResponse = await verifyWebAuthnRegistration(username, webAuthnOptions);

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
