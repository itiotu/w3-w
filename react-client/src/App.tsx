import React from 'react';
import './App.css';
import {SocketIoContext, socketIo} from './Context/SocketContext'
import { WalletApp } from './WalletApp';

function App() {
  return <>
    <SocketIoContext.Provider value={socketIo}>
      <WalletApp />;
    </SocketIoContext.Provider>
  </>
}

export default App;
