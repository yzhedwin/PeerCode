const PORT = 3001;
let connectionRequest = require('./DBConn')


const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log('API is running on Port 3001'));


app.post('/update', (req, res) => {
  let db = connectionRequest()
  let userObject = req.body.user;
  let testInsertQuery = "INSERT INTO users(email, displayname, username, proficiency) VALUES (\"woobt123@gmail.com\", \"" + userObject.displayName + "\", \"" + userObject.username + "\", " + userObject.proficiency + ")"
  console.log(testInsertQuery);

  db.query(testInsertQuery, (err, res) => {
    if (err) {
      db.destroy();
      throw err;
    }
    console.log(res);
  })

})


app.post('/select', (req, res) => {
  let db = connectionRequest()
  let testInsertQuery = "SELECT * FROM users"

  db.query(testInsertQuery, (err, res) => {
    if (err) {
      db.destroy();
      throw err;
    }
    console.log(res);
  })
})
