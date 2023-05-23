

const express = require('express');
const routes = require('./api');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json());


//initialize routes 
app.use('/api',routes);

// listen for requests
app.listen(process.env.PORT,function(){
    console.log('Listening...')
});

