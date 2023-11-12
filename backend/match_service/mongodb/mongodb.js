const { MongoClient } = require("mongodb");
const db_uri = process.env.MONGO_PEERCODE_URL;

module.exports = new MongoClient(db_uri);
