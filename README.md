# Wallet app

## Setup

### Prerequisites

1. If a new docker-compose file was provided separately with env variables, please override the current docker-compose file with the newly provided one.
2. Please ensure docker daemon is running locally.
3. Please ensure that following local ports must not be used: `5555, 8081, 3333`. If they are, please update the docker-compose file with new ports.

### Run instructions
1. Make sure the docker-compose file has a valid Alchemy API key under `services.backend.environment.ETH_NODE_API_KEY`
2. Execute `./start.sh`
   1. This command will build the docker images for the backend-service and the react-client and then will use the docker-compose file to start the docker containers.
3. Access the React client using http://localhost:8081

## Demo

Short demo of the application can be seen on : https://www.youtube.com/watch?v=WBb_cmWolWc


