echo "Building tensorflow base image..."
docker build --tag=glados:tf tf
echo "Building server image..."
docker build --tag=glados:server server
