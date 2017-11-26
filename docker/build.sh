if [ -f ./server/pkg.tar.gz ]; then
  rm ./server/pkg.tar.gz
fi

echo "Creating server tar pkg..."
pushd ..
tar --exclude="node_modules" -zcvf docker/server/pkg.tar.gz ./server
popd

if [ -f ./cnn_model/pkg.tar.gz ]; then
  rm ./cnn_model/pkg.tar.gz
fi

echo "Creating cnn_model tar pkg..."
pushd ..
tar --exclude="GTSRB" -zcvf docker/server/cnn.tar.gz ./cnn_model
popd
#
# echo "Building tensorflow base image..."
# docker build --tag=glados:tf tf

echo "Building server image..."
docker build --tag=glados:server server
