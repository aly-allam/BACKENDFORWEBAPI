

const express = require('express');
const routes = require('./api');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json());


//initialize routes 
app.use('/api',routes);

// listen for requests
app.listen(8080,function(){
    console.log('Listening...')
});

