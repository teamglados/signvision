#!/bin/bash
echo "Starting flask..."
python /opt/cnn_model/app.py &

echo "Starting node..."
node /opt/server/index.js &

while /bin/true; do
  ps aux |grep app.py |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep index.js |grep -q -v grep
  PROCESS_2_STATUS=$?

  # If the greps above find anything, they will exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "Process exit."
    exit -1
  fi
  sleep 60
done
