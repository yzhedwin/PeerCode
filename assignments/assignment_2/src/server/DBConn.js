const mysql = require('mysql2');

module.exports = function () {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'qu%rK1ness',
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