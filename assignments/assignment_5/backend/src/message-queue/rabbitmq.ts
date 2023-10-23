import * as amqp from 'amqplib';
require('dotenv').config(); // Load environment variables from .env

const MATCH_TIMEOUT = parseInt(process.env.MATCH_TIMEOUT || '5');
const rabbitmqUrl = process.env.RABBITMQ_URL;
function timeout(time: any) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private cancelled: boolean = false;
  private consumer_id: string = '';

  public getChannel() {
    if (this.channel) {
      return this.channel;
    }
  }
  public setCancelled(cancel: boolean) {
    this.cancelled = cancel;
  }
  public setConsumerID(id: string) {
    this.consumer_id = id;
  }
  public getConsumerID() {
    return this.consumer_id;
  }
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
      await this.channel.assertQueue('cancelMatchmaking', { durable: true });
      this.channel.prefetch(1);
      // Bind queues to the exchange with routing keys
      await this.channel.bindQueue('easy', 'matchmaking', 'easy');
      await this.channel.bindQueue('medium', 'matchmaking', 'medium');
      await this.channel.bindQueue('hard', 'matchmaking', 'hard');
      await this.channel.bindQueue('matched', 'matchmaking', 'matched');
      await this.channel.bindQueue(
        'cancelMatchmaking',
        'matchmaking',
        'cancelMatchmaking'
      );
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

  publishMessage(queue: string, message: string) {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }

    try {
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Message sent to queue "${queue}": ${message}`);
    } catch (error: any) {
      console.error(
        `Error sending message to queue "${queue}":`,
        error.message
      );
    }
  }
  async consumeMessage(
    queue: string,
    callback: (message: any, tag: string) => void
  ) {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }
    try {
      // Consume messages from the specified queue
      await this.channel.consume(
        queue,
        (message) => {
          if (message) {
            return callback(message.content, message.fields.consumerTag);
          }
        },
        { noAck: true }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async matchMaking(queue: string, callback: (players: Array<string>) => void) {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }
    try {
      // Consume messages from the specified queue
      await this.channel.consume(
        queue,
        async (message) => {
          if (message) {
            this.cancelled = false;
            const player = JSON.parse(message.content.toString());
            // Find a match for the player based on difficulty level
            const matchQueue = this.getMatchQueue(queue);
            const status = await this.channel?.checkQueue(queue);
            console.log(status);
            // find match for x seconds
            let matchedPlayer = null;
            for (
              let index = 0;
              index < MATCH_TIMEOUT && !this.cancelled;
              index++
            ) {
              const status = await this.channel?.checkQueue(queue);
              console.log(status);
              matchedPlayer = await this.findMatch(player, matchQueue);
              if (matchedPlayer) {
                console.log('matched');
                const players = [player, matchedPlayer];
                this.channel?.ack(message);
                console.log('acked');
                return callback(players);
              }
              console.log('retry in 1s');
              await timeout(1000);
            }
            if (this.channel) {
              this.channel.ack(message);
              console.log('timeout: acked');
            }
          }
        },
        { noAck: false }
      );
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
