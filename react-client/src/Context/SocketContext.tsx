import React from "react";
import { io, Socket } from "socket.io-client";

if (!process.env.REACT_APP_SOCKET_ENDPOINT) {
    throw new Error('Socket endpoint env variable is not setup.');
}

export const socketIo: Socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);

export const SocketIoContext = React.createContext(socketIo);

