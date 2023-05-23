require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql');

// Connection configurations
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to the database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = connection;
