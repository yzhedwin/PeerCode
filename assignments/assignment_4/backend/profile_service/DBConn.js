const mysql = require('mysql2');
const dotenv = require("dotenv")
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

module.exports = function () {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.MY_SQL_PASSWORD,
        database: 'peerPrepAssignment'
    });

    db.connect(function (err) {
        if (err) {
            console.log(err)
            console.log("DB Request Failed")
        }
    });

    return db
}

