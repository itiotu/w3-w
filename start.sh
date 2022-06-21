docker build -t client-w3 ./react-client
docker build -t backend-w3 ./backend-service

docker-compose -f docker-compose.yml up
