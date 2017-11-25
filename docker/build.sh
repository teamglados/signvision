if [ -f ./server/pkg.tar.gz ]; then
  rm ./server/pkg.tar.gz
fi

echo "Creating tar pkg..."
pushd ..
tar --exclude="node_modules" -zcvf docker/server/pkg.tar.gz ./server
popd

echo "Building tensorflow base image..."
docker build --tag=glados:tf tf

echo "Building server image..."
docker build --tag=glados:server server
