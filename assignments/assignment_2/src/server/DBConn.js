const mysql = require('mysql2');
require('dotenv').config();

module.exports = function () {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.MY_SQL_PASSWORDD,
        database: 'peerPrepAssignment'
    });

    db.connect(function (err) {
        if (err) {
            console.log(`DB Connection Request Failed ${err.stack}`)
        } else {
            console.log(`DB Connection Request Successful ${db.threadid}`)
        }
    });

    return db
}