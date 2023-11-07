const { MongoClient } = require("mongodb");
const db_uri =
    "mongodb://" +
    process.env.MONGO_PEERCODE_DATABASE_USER +
    ":" +
    process.env.MONGO_PEERCODE_DATABASE_PASSWORD +
    "@" +
    process.env.MONGO_PEERCODE_HOST_NAME +
    ":27017/" +
    process.env.MONGO_PEERCODE_DATABASE_NAME;


module.exports = new MongoClient(db_uri);
