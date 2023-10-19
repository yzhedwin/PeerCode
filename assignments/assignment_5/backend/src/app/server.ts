import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/matchmaking'; // Import your matchmaking routes here
import rabbitmq from '../message-queue/rabbitmq';

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors()); // Enable CORS for your API
app.use(bodyParser.json()); // Parse JSON requests

// Routes
app.use('/api/matchmaking', routes); // Mount your matchmaking routes

// Error handler middleware (You can create your own error-handler.ts)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize RabbitMQ (await here if needed)
// Matchmaking server
(async () => {
  await rabbitmq.initialize();
  //manage chat rooms here
  await rabbitmq.matchMaking('easy', (players) => {
    console.log(players);
    const data = { players: players, difficulty: 'easy' };
    rabbitmq.publishMessage('matched', JSON.stringify(data));
  });
  await rabbitmq.matchMaking('medium', (players) => {
    console.log(players);
    const data = { players: players, difficulty: 'medium' };
    rabbitmq.publishMessage('matched', JSON.stringify(data));
  });
  await rabbitmq.matchMaking('hard', (players) => {
    console.log(players);
    const data = { players: players, difficulty: 'hard' };
    rabbitmq.publishMessage('matched', JSON.stringify(data));
  });
  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
