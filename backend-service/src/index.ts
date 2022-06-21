import 'dotenv/config';
import { createServer } from 'http';
import ClientSocketService from "./services/Socket/ClientSocketService";
import ProcessVariablesValidator from "./utils/ProcessVariablesValidator";
import AlchemySocket from "./services/Socket/AlchemySocket";

ProcessVariablesValidator.validate();

export const httpServer = createServer();
AlchemySocket.registerListenersForAllWallets().then(r => {
    console.log('Registered listeners for all wallets');
    httpServer.listen(process.env.PORT, () => {
        ClientSocketService.getInstance();
    });
});






