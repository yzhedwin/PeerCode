import rabbitmq from '../message-queue/rabbitmq';

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
  await rabbitmq.consumeMessage('cancelMatchmaking', (message) => {
    if (message) {
      console.log(message);
      rabbitmq.setCancelled(true);
    }
  });
})();
