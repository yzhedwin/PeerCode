import { Server, Socket } from 'socket.io';
import RabbitMQService from '../message-queue/rabbitmq'; // Import the RabbitMQ service

export function initializeSocketHandlers(io: Server) {
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
      socket.on('disconnecting', async () => {
        console.log('disconnecting...', RabbitMQService.getConsumerID());
        await RabbitMQService.getChannel()?.cancel(
          RabbitMQService.getConsumerID()
        );
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
      socket.on('cancelMatchmaking', () => {
        console.log('cancel', socket.id);
        RabbitMQService.publishMessage('cancelMatchmaking', socket.id);
      });

      // Get matched users here
      RabbitMQService.consumeMessage('matched', (message, consumer_id) => {
        if (message) {
          const data = JSON.parse(message);
          const room_id =
            data['difficulty'] +
            '-' +
            data['players'][0]['userId'] +
            '-' +
            data['players'][1]['userId'];
          //Emit room_id to both users so users can join room
          socket.to(data['players'][0]['userId']).emit('matchSuccess', room_id);
          socket.to(data['players'][1]['userId']).emit('matchSuccess', room_id);
          RabbitMQService.setConsumerID(consumer_id);
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
