import './App.css';
import { WalletApp } from './WalletApp';
import React from "react";
import {SocketIoContext, socketIo} from './Context/SocketContext'

function App() {
  return <>
    <SocketIoContext.Provider value={socketIo}>
      <WalletApp />;
    </SocketIoContext.Provider>
  </>
}

export default App;
