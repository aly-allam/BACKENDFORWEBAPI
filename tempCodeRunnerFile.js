const mysql = require('mysql');

// connection configurations
var connection = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    user: '	sql7620092',
    password: '8fcK1g6b4Z',
    database: 'sql7620092'
});
// connect to database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

module.exports = connection;

