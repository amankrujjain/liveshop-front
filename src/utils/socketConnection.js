import { toast } from 'react-hot-toast'; // Import the toast function

let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
let reconnectToastStack = []; // Stack to manage toasts
let isShowingToast = false; // Flag to show if a toast is currently being displayed

export const initWebSocket = () => {
    console.log("Initializing WebSocket...");

    if (!socket) {
        connectWebSocket();
    }

    // Ensure event listeners are added only once
    if (!window.hasWebSocketListeners) {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.hasWebSocketListeners = true; // Prevent multiple event listener setups
    }
};

const connectWebSocket = () => {
    console.log("Attempting to connect WebSocket...");

    // Check if the network is online before attempting to connect
    if (!navigator.onLine) {
        console.warn("Network is offline. Waiting for network to be restored...");
        handleDisconnection(); // Treat this as a disconnection
        return; // Don't attempt to connect if the network is offline
    }

    socket = new WebSocket("wss://liveshop-back.onrender.com");

    socket.onopen = () => {
        console.log("WebSocket connection established.");
        reconnectAttempts = 0; // Reset reconnection attempts on successful connection

        clearToastStack(); // Clear the stack and dismiss any existing reconnect toast
    };

    socket.onclose = (event) => {
        console.log("WebSocket closed event:", event);
        if (!event.wasClean) {
            console.error("WebSocket connection lost. Attempting to reconnect...");
            handleDisconnection(); // Notify the user of disconnection
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error.message);
        pushToastToStack(() => toast.error("WebSocket error occurred")); // Push error toast to the stack
        handleDisconnection(); // Handle immediate disconnection
    };

    socket.onmessage = (event) => {
        console.log("Message from server:", event.data);
        // Handle incoming WebSocket messages here
    };
};

// Handle Immediate Disconnection
const handleDisconnection = () => {
    console.log("Connection lost. Starting reconnection attempts...");
    handleReconnection(); // Attempt to reconnect immediately
};

// Reconnection Logic
const handleReconnection = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
        console.error("Max reconnection attempts reached. Unable to reconnect.");

        // Clear the stack to stop further reconnect attempts
        clearToastStack();

        // Show max attempts reached toast
        pushToastToStack(() => toast.error("Max reconnection attempts reached. Unable to reconnect."));
        return;
    }

    reconnectAttempts++;

    // Push the reconnection toast to the stack
    pushToastToStack(() => toast.loading(`Reconnecting... (Attempt ${reconnectAttempts})`));

    if (navigator.onLine) {
        setTimeout(() => {
            console.log(`Attempting to reconnect... (Attempt ${reconnectAttempts})`);
            connectWebSocket(); // Try to reconnect if the network is online
        }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)); // Exponential backoff
    } else {
        console.log("Network is still offline. Waiting for network restoration...");
        setTimeout(handleReconnection, 5000); // Retry reconnection after 5 seconds if offline
    }
};

// Toast Stack Management
const pushToastToStack = (toastFunc) => {
    reconnectToastStack.push(toastFunc);  // Push new toast function onto the stack
    showNextToast();                      // Show the next toast
};

// Function to show the next toast in the stack
const showNextToast = () => {
    if (!isShowingToast && reconnectToastStack.length > 0) {
        isShowingToast = true;            // Set flag to indicate a toast is being displayed
        const nextToast = reconnectToastStack.pop(); // Get the last toast from the stack (LIFO)
        const toastId = nextToast();      // Execute the toast function
        
        // Dismiss toast after a certain time and allow the next one to show
        setTimeout(() => {
            toast.dismiss(toastId);
            isShowingToast = false;       // Reset flag
            showNextToast();              // Recursively show the next toast in the stack
        }, 5000); // Adjust timeout as per your requirement
    }
};

// Clear the stack and dismiss any remaining toasts
const clearToastStack = () => {
    reconnectToastStack = [];             // Empty the stack
    toast.dismiss();                      // Dismiss any active toasts
    isShowingToast = false;               // Reset flag
};

// Online and Offline Event Listeners
const handleOnline = () => {
    console.log("Network is back online. Attempting to reconnect WebSocket...");

    // Clear the stack to stop further reconnect attempts
    clearToastStack();

    // Show success toast for restored internet
    pushToastToStack(() => toast.success("Internet connection restored."));

    // Prevent further reconnection logic once the internet is restored
};

const handleOffline = () => {
    console.log("Network is offline. WebSocket connection may be disrupted.");
    pushToastToStack(() => toast.error("Internet connection lost."));
    handleDisconnection(); // Immediately handle disconnection when the internet goes offline
};

// Function to send a message through the WebSocket
export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Sending message:", message);
        socket.send(message);
    } else {
        console.error("WebSocket is not open. Cannot send message.");
        pushToastToStack(() => toast.error("Cannot send message. WebSocket is not connected."));
    }
};

// Remove event listeners on cleanup (optional)
export const removeEventListeners = () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
};


// almost good but the one additional display of reconnection is there 
// and the limit exceeded one