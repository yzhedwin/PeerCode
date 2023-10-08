db = new Mongo().getDB(process.env.MONGO_PEERCODE_DATABASE_NAME);

db.createUser({
  user: process.env.MONGO_PEERCODE_DATABASE_USER,
  pwd: process.env.MONGO_PEERCODE_DATABASE_PASSWORD,
  roles: [
    {
      role: "readWrite", // cannot be 'root'
      db: process.env.MONGO_PEERCODE_DATABASE_NAME,
    },
  ],
});
db.createCollection("questions", { capped: false });
db.createCollection("solutions", { capped: false });
db.createCollection("submissions", { capped: false });
