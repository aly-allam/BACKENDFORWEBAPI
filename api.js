const express = require('express');
const router = express.Router();
const connection = require('./mysql')
const axios = require('axios');
require('dotenv').config();

// get a list of trips from the DB 
router.get('/trips', function(req,res){
    connection.query("select * from trips" , (err,result)=>{
				if(err){res.send("error in the connection")}
        else{res.send(result)}
})	
});




//Get a trip by ID 
router.get('/trips/:id', function(req,res){
    let tripID = req.params.id
    connection.query('SELECT * FROM trips where id = ?' ,tripID, (err, result)=> {
        if(err)throw err;
        else{res.send(result)}
    })
})

// Delete a trip 
router.delete('/trips/:id', function(req,res){
    let tripID = req.params.id
    connection.query('delete from trips where id = ?' , tripID , (err, result)=>{
        if(err)throw err;
        else{res.send({ error: false, data: result})}
    })
})

// Add a new trip
router.post('/trips', function(req, res){
    let newTrip = req.body;

    connection.query('INSERT INTO trips SET ?', newTrip, (err, result) => {
        if(err) throw err;
        else {
            res.send({ error: false, data: result });
        }
    });
});

//////////////////////////////////////////////////////

// Get all trips with a specific date and location
router.get('/trips/date/:date/return/:returnDate/location/:location', function(req, res) {
  let date = req.params.date;
  let location = req.params.location;
  let returnDate = req.params.returnDate;

  connection.query('SELECT * FROM trips WHERE date = ? AND location = ? AND returnDate = ?', [date, location, returnDate], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving trips');
    } else {
      res.send(result);
    }
  });
});


  // Get all trips with a specific date and budget
  router.get('/trips/date/:date/return/:returnDate/fees/:fees', function(req, res) {
    let date = req.params.date;
    let fees = req.params.fees;
    let returnDate = req.params.returnDate;
  
    connection.query('SELECT * FROM trips WHERE date = ? AND fees <= ? AND returnDate = ?', [date, fees, returnDate], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving trips');
      } else {
        res.send(result);
      }
    });
  });



// PUT => update a trip's airfare
router.put('/trips/:id/airfare', function(req, res) {
  let id = req.params.id;
  let airfare = req.body.airfare;

  connection.query('UPDATE trips SET airfare = ? WHERE id = ?', [airfare, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating trip airfare');
    } else {
      connection.query('UPDATE trips SET fees = airfare + (duration * (accommodationPerDay + mealsPerDay)) WHERE 1', (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating trip fees');
        } else {
          res.send({ error: false, data: result });
        }
      });
    }
  });
});

// PUT => update a trip's accommodationPerDay
router.put('/trips/:id/accommodation', function(req, res) {
  let id = req.params.id;
  let accommodationPerDay = req.body.accommodationPerDay;

  connection.query('UPDATE trips SET accommodationPerDay = ? WHERE id = ?', [accommodationPerDay, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating trip accommodationPerDay');
    } else {
      connection.query('UPDATE trips SET fees = airfare + (duration * (accommodationPerDay + mealsPerDay)) WHERE 1', (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating trip fees');
        } else {
          res.send({ error: false, data: result });
        }
      });
    }
  });
});

// PUT => update a trip's mealsPerDay
router.put('/trips/:id/meals', function(req, res) {
  let id = req.params.id;
  let mealsPerDay = req.body.mealsPerDay;

  connection.query('UPDATE trips SET mealsPerDay = ? WHERE id = ?', [mealsPerDay, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating trip mealsPerDay');
    } else {
      connection.query('UPDATE trips SET fees = airfare + (duration * (accommodationPerDay + mealsPerDay)) WHERE 1', (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating trip fees');
        } else {
          res.send({ error: false, data: result });
        }
      });
    }
  });
});


// Fetch meals from the third-party API
router.get('/meals/:nationality', async (req, res) => {
  try {
    const nationality = req.params.nationality;
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${nationality}`);
    res.send(response.data.meals || []);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving meals');
  }
});

// Fetch meals from the third-party API
router.get('/meals/:nationality', async (req, res) => {
  try {
    const nationality = req.params.nationality;
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${nationality}`);
    res.send(response.data.meals || []);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving meals');
  }
});

// Fetch weather from the third-party API
router.get('/weather/:latitude/:longitude', async (req, res) => {
  try {
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving weather');
  }
});

// Fetch currency exchange rate from the third-party API
router.get('/currency/:currency', async (req, res) => {
  try {
    const currency = req.params.currency;
    const apiKey = process.env.CURRCONV_API_KEY;
    const response = await axios.get(`https://free.currconv.com/api/v7/convert?q=${currency}_EGP&compact=ultra&apiKey=${apiKey}`);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving currency exchange rate');
  }
});


  


// to be able to use the API in the index file 
module.exports = router;




