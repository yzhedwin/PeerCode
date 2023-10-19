import * as amqp from 'amqplib';

require('dotenv').config(); // Load environment variables from .env

const rabbitmqUrl = process.env.RABBITMQ_URL;

class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async initialize() {
    try {
      // Connect to RabbitMQ server
      if (rabbitmqUrl === undefined) {
        throw new Error('RABBITMQ_URL is not defined in the .env file.');
      }
      this.connection = await amqp.connect(rabbitmqUrl);
      // Create a channel
      this.channel = await this.connection.createChannel();

      // Declare the exchange and queues
      await this.channel.assertExchange('matchmaking', 'direct', {
        durable: true,
      });
      await this.channel.assertQueue('easy', { durable: true });
      await this.channel.assertQueue('medium', { durable: true });
      await this.channel.assertQueue('hard', { durable: true });
      await this.channel.assertQueue('matched', { durable: true });
      this.channel.prefetch(1);
      // Bind queues to the exchange with routing keys
      await this.channel.bindQueue('easy', 'matchmaking', 'easy');
      await this.channel.bindQueue('medium', 'matchmaking', 'medium');
      await this.channel.bindQueue('hard', 'matchmaking', 'hard');
      await this.channel.bindQueue('matched', 'matchmaking', 'matched');

      console.log('RabbitMQ initialized successfully');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
    }
  }

  // WIP trying to figure out how to remove people from queue
  // https://stackoverflow.com/questions/53273463/how-to-remove-specific-message-from-queue-in-rabbitmq
  // async removeUserFromQueue(queue: string, userId: string) {
  //   if (!this.channel) {
  //     console.error('RabbitMQ channel not initialized');
  //     return;
  //   }

  //   try {
  //     for (const consumerTag in this.consumers) {
  //       if (this.consumers[consumerTag] === userId) {
  //         await this.channel.cancel(consumerTag);
  //         console.log(`User ${userId} removed from queue`);
  //         // Remove the user from the consumers object
  //         delete this.consumers[consumerTag];
  //       }
  //     }
  //   } catch (error: any) {
  //     console.error(
  //       `Error removing user ${userId} from queue "${queue}":`,
  //       error.message
  //     );
  //   }
  // }

  async publishMessage(queue: string, message: string) {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }

    try {
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Message sent to queue "${queue}": ${message}`);
      const qq = await this.channel.checkQueue(queue);
      console.log(qq);
    } catch (error: any) {
      console.error(
        `Error sending message to queue "${queue}":`,
        error.message
      );
    }
  }

  async consumeMessage(
    queue: string,
    callback: (players: Array<string>) => void
  ) {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }

    try {
      // Consume messages from the specified queue
      this.channel.consume(queue, async (message) => {
        if (message) {
          const player = JSON.parse(message.content.toString());
          // Find a match for the player based on difficulty level
          const matchQueue = this.getMatchQueue(queue);
          // find match for x seconds
          const interval_id = setInterval(async () => {
            const queueStatus = await this.channel?.checkQueue(queue);
            console.log(queueStatus);
            let matchedPlayer = await this.findMatch(player, matchQueue);
            if (matchedPlayer) {
              const players = [player, matchedPlayer];
              clearTimeout(timeout_id);
              clearInterval(interval_id);
              this.channel?.ack(message);
              return callback(players);
            }
            // Create a room and send players to it
            //   this.createRoomAndSendPlayers(queue, players);
            // } else {
            //   // No match found, requeue the message
            //   // time out here?
            //   this.channel?.nack(message);
          }, 1000);
          const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            clearInterval(interval_id);
            this.channel?.ack(message);
          }, 5000);
        }
      });
    } catch (error: any) {
      console.error(
        `Error consuming messages from queue "${queue}":`,
        error.message
      );
    }
  }

  // Helper function to determine the appropriate match queue based on the player's queue
  private getMatchQueue(queue: string): string {
    switch (queue) {
      case 'easy':
        return 'easy';
      case 'medium':
        return 'medium';
      case 'hard':
        return 'hard';
      default:
        throw new Error(`Invalid queue: ${queue}`);
    }
  }

  // Helper function to find a match for a player in the specified match queue
  private async findMatch(
    player: any,
    matchQueue: string
  ): Promise<any | null> {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return null;
    }

    try {
      // Retrieve messages from the match queue
      let result = await this.channel.get(matchQueue);
      if (result !== false && result.content) {
        const matchedPlayer = JSON.parse(result.content.toString());
        return matchedPlayer;
      }

      return null;
    } catch (error: any) {
      console.error(
        `Error finding a match in queue "${matchQueue}":`,
        error.message
      );
      return null;
    }
  }
}

export default new RabbitMQService();
