import { Server, Socket } from 'socket.io';
import { MatchmakingLogic } from '../matchmaking/matchmaking-logic'; // Import your matchmaking logic
import RabbitMQService from '../message-queue/rabbitmq'; // Import the RabbitMQ service

export function initializeSocketHandlers(io: Server) {
  const matchmakingLogic = new MatchmakingLogic(); // Create an instance of your matchmaking logic

  io.on('connection', (socket: Socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);
    RabbitMQService.initialize().then(() => {
      //Tell web app that system is ready for matchmaking
      socket.emit('initMatchQueue', 'initialized');
      // Handle user disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected with socket ID: ${socket.id}`);
        // Implement any necessary cleanup or disconnection logic
      });
      // Handle matchmaking requests
      socket.on(
        'joinMatchmaking',
        (data: { userId: string; difficulty: string }) => {
          const { userId, difficulty } = data;
          console.log('get match');
          RabbitMQService.publishMessage(
            difficulty.toLowerCase(),
            JSON.stringify({ userId })
          );
        }
      );
      // Get matched users here
      RabbitMQService.consumeMessage('matched', (message) => {
        if (message) {
          const data = JSON.parse(message);
          const room_id =
            data['difficulty'] +
            data['players'][0]['userId'] +
            data['players'][1]['userId'];
          //Emit room_id to both users so users can join room
          socket.to(data['players'][0]['userId']).emit('matchSuccess', room_id);
          socket.to(data['players'][1]['userId']).emit('matchSuccess', room_id);
          RabbitMQService.getChannel()
            ?.checkQueue('matched')
            .then((status) => {
              console.log(data, status);
            });
        }
      });
    });

    // Handle other WebSocket events as needed
    // ...

    // Example of sending a message to the client
    // socket.emit('message', 'Hello, client!');
  });
}
