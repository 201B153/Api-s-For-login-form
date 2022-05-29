import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import seedRouter from './routes/seedRoutes.js';
import userRouter from './routes/userRoutes.js';
import otpRouter from './routes/otpRouter.js';


dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/seed', seedRouter);

app.use('/api/users', userRouter);

app.use('/api/otp', otpRouter)

// API to send OTP on given mobile no.
app.post(
    '/sendOTP',
    expressAsyncHandler(async (req, res) => {
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
        else console.log(body);
        console.log({ phone, details }, { message: 'OTPsend' });
        res.status(200).send({ phone, details }, { message: 'OTP Send' });
      });
    })
  );
// API to Verify OTP .
app.post(
    '/verifyOTP',
    expressAsyncHandler(async (req, res) => {
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
        res.status(200).send({ phone, details }, { message: 'OTP Matched' });
      });
    })
  );


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});