import * as amqp from 'amqplib';
require('dotenv').config(); // Load environment variables from .env

const MATCH_TIMEOUT = parseInt(process.env.MATCH_TIMEOUT || '5');
const rabbitmqUrl = process.env.RABBITMQ_URL;
function timeout(time: any) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const queue_suffix = process.env.NODE_ENV === "production" ? "-as5-prod" : "-as5-dev";

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
      await this.channel.assertQueue(this.getQueue('easy'), { durable: true });
      await this.channel.assertQueue(this.getQueue('medium'), { durable: true });
      await this.channel.assertQueue(this.getQueue('hard'), { durable: true });
      await this.channel.assertQueue(this.getQueue('matched'), { durable: true });
      await this.channel.assertQueue(this.getQueue('cancelMatchmaking'), { durable: true });
      this.channel.prefetch(1);
      // Bind queues to the exchange with routing keys
      await this.channel.bindQueue(this.getQueue('easy'), 'matchmaking', this.getQueue('easy'));
      await this.channel.bindQueue(this.getQueue('medium'), 'matchmaking', this.getQueue('medium'));
      await this.channel.bindQueue(this.getQueue('hard'), 'matchmaking', this.getQueue('hard'));
      await this.channel.bindQueue(this.getQueue('matched'), 'matchmaking', this.getQueue('matched'));
      await this.channel.bindQueue(
        this.getQueue('cancelMatchmaking'),
        'matchmaking',
        this.getQueue('cancelMatchmaking')
      );
      console.log('RabbitMQ initialized successfully');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
    }
  }

  publishMessage(unparsedQueue: string, message: string) {
    const queue = this.getQueue(unparsedQueue)
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
    unparsedQueue: string,
    callback: (message: any, tag: string) => void
  ) {
    const queue = this.getQueue(unparsedQueue)
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

  async matchMaking(unparsedQueue: string, callback: (players: Array<string>) => void) {
    const queue = this.getQueue(unparsedQueue)
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
              matchedPlayer = await this.findMatch(player, queue);
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

  // Helper function to determine the appropriate match queue based on the env
  public getQueue(queue: string): string {
    switch (queue) {
      case 'easy':
        return 'easy' + queue_suffix;
      case 'medium':
        return 'medium' + queue_suffix;
      case 'hard':
        return 'hard' + queue_suffix;
      case 'matched':
        return 'matched' + queue_suffix;
      case 'cancelMatchmaking':
        return 'cancelMatchmaking' + queue_suffix;
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
