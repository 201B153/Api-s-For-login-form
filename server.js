require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

APIKEY = process.env.API_KEY;
//APIKEY="fda7bc0b-20f9-11e7-929b-00163ef91450";

const crypto = require('crypto');
const smsKey = process.env.SMS_SECRET_KEY;

// Adding Jwt Tokens
const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
let refreshTokens = [];

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

app.post('/sendOTP', (req, res) => {
  // const phone = req.body.phone;
  var request = require('request');

  var options = {
    method: 'GET',
     url: `http://2factor.in/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450/SMS/6265187023/AUTOGEN/educheck_otp`,
    // url: `http://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN/educheck_otp`,
	// https://2factor.in/API/V1/{api_key}/SMS/{phone_number}/AUTOGEN/{template_name}
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {},
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    else 
    console.log(body);
	console.log({ phone, details }, {message: 'OTPsend'})
	res.status(200).send({ phone, details }, {message: 'OTP Send'});
  });
});

app.post(
  '/verifyOTP',
  (req, res) => {
    //   const otp = req.body.otp;
    var request = require('request');
    var options = {
      method: 'GET',
      url: 'http://2factor.in/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450/SMS/VERIFY/e47c3993-5830-4b09-8665-360de42e30f2/753325',
	//   https://2factor.in/API/V1/{api_key}/SMS/VERIFY/{session_id}/{otp_input}
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: {},
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
	  res.status(200).send({ phone, details }, {message: 'OTP Matched'});
    });
  }
);

app.post('/home', authenticateUser, (req, res) => {
  console.log('home private route');
  res.status(202).send('Private Protected Route - Home');
});

app.listen(process.env.PORT || 8888);
