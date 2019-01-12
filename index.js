const express = require('express');
const tzlookup = require('tz-lookup');
const moment = require('moment-timezone');
const app = express();

const PORT = 3000;

app.get('/', function (req, res) {
  res.status(200).send({ message: 'Example call: /timezone?lat=42.7235&lon=-73.6931', version: '1.0.0' });
});

app.get('/timezone', function (req, res) {
  const { lat, lon } = req.query;
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (!lat || !lon || isNaN(latitude) || isNaN(longitude)) {
    res.status(400).send({ message: 'Invalid arguments. Example call: /timezone?lat=42.7235&lon=-73.6931' });
    return;
  }

  const timezone = tzlookup(latitude, longitude);
  const zone = moment.tz.zone(timezone);
  const timestamp = req.query.timestamp || Date.now();

  const response = {
    lat: latitude,
    lon: longitude,
    timezone: timezone,
    zone: zone.parse(+timestamp)
  }

  res.status(200).send(response);
});

app.listen(PORT);
console.log('Listening on port ' + PORT);
