import React from "react";
import socketIOClient from "socket.io-client";

export const socketIo = socketIOClient(process.env.REACT_APP_SOCKET_ENDPOINT);
export const SocketIoContext = React.createContext(socketIo);

