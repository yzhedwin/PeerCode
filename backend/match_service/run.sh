#!/bin/bash

# Start the first process
node ./matchmaking/index.js &

# Start the second process
node ./server.js &

# Start openAI router
node ./router/openai_router.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?