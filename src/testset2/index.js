'use strict';
 
const smartcar = require('smartcar');
const express = require('express');
const uvipay = require('uvipay');
uvipay.setApiPrivateKey('sk_test_07e5530c66c19f914740beebc14cd7f8');


const app = express();
 
const port = 4000;
 
const client = new smartcar.AuthClient({
  clientId: '8ba9f9bf-e8aa-48a7-9142-7a3077de0fea',
  clientSecret: '6f83186e-3ab1-49f3-aee0-1ed16280254c',
  redirectUri: 'http://localhost:8000/callback',
  scope: ['read_vehicle_info'],
  testMode: true, // launch the Smartcar auth flow in test mode
});
app.get('/charge', function(request,res) {
// Get token from GET/POST data
    /* Use your http server framework to fetch UvibaToken parameter */
    var token = request.body.UvibaToken;

// Amount to charge
    /* Amount in cents to charge the customer. 1$ = 100 */
    var amount = 1000;

// Parameters
    /* Additional parameters to add to charge. More details available at https://pay.uviba.com/ */
    var params = {};

    uvipay.charge(token, amount, params).then(function(response) {

        // Payment is completed and charge details provided in response
console.log(response);
    }).catch(function(message) {

        // Payment failed. More details may be available in message

        console.log('UviPay failed to charge: ' + message);

    });
});
// Redirect to Smartcar's authentication flow
app.get('/login', function(req, res) {
 
  const link = client.getAuthUrl({state: 'mode=test'});

  // redirect to the link
  res.redirect(link);
});
 
// Handle Smartcar callback with auth code
app.get('/callback', function(req, res, next) {
  let access;
 
  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }
 
  // exchange auth code for access token
  return client.exchangeCode(req.query.code)
    .then(function(_access) {
      // in a production app you'll want to store this in some kind of persistent storage
      access = _access;
      // get the user's vehicles
      return smartcar.getVehicleIds(access.accessToken);
    })
    .then(function(res) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(res.vehicles[0], access.accessToken);
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(data) {
      console.log(data);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }
 
      // json response will be sent to the user
      res.json(data);
    });
});
 
app.listen(port, () => console.log(`Listening on port ${port}`));