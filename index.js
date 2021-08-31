const express = require('express');
const tzlookup = require('tz-lookup');
const moment = require('moment-timezone');
var cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

const whitelist = [
  'http://localhost:8080',
  'https://brugarolas.github.io',
  'https://brugarolas.openode.io',
  'https://bruga-time-zone.herokuapp.com',
  'https://andres-brugarolas.com',
  'https://www.andres-brugarolas.com'
];

const includedInWhitelist = (origin) => {
  return Boolean(whitelist.find(validOrigin => origin.startsWith(validOrigin)))
}

const options = {
  origin: (origin, callback) => {
    console.log(origin)
    !origin || includedInWhitelist(origin) ? callback(undefined, true) : callback(new Error(`Not allowed by CORS (${origin})`))
  },
  optionsSuccessStatus: 200
}

app.get('/', cors(options), function (req, res) {
  res.status(200).send({ message: 'Example call: /timezone?lat=42.7235&lon=-73.6931', version: '1.0.0' });
});

app.get('/timezone', cors(options), function (req, res) {
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
    offset: zone.parse(+timestamp)
  }

  res.status(200).send(response);
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
