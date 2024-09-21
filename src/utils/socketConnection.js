let socket;

export const initWebSocket = () => {
    // Initialize WebSocket connection
    socket = new WebSocket("wss://your-websocket-url");

    socket.onopen = () => {
        console.log("WebSocket connection established.");
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log("WebSocket closed cleanly");
        } else {
            console.log("WebSocket connection lost, attempting to reconnect...");
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error.message);
    };

    socket.onmessage = (event) => {
        console.log("Message from server:", event.data);
    };
};

// Function to send a message through the WebSocket
export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error("WebSocket is not open. Cannot send message.");
    }
};
