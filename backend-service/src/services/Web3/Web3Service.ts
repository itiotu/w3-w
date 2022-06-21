import { AlchemyWeb3, createAlchemyWeb3 } from '@alch/alchemy-web3';

export default class Web3Service {
    public static instance: AlchemyWeb3;

    static getInstance() {
        if (!this.instance) {
            this.instance = Web3Service.init();
        }

        return this.instance;
    }

    static init(): AlchemyWeb3 {
        const nodeUrl = `wss://eth-${process.env.ETH_NETWORK}.ws.alchemyapi.io/ws/${process.env.ETH_NODE_API_KEY}`;

        return createAlchemyWeb3(nodeUrl);
    }
}
