import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth } from '../utils.js';
import axios from 'axios';

const otpRouter = express.Router();

otpRouter.get('/home', async (req, res) => {
  console.log('home private route');
  res.status(202).send('Private Protected Route - Otp Home');
});
otpRouter.post('/home', async (req, res) => {
  const phone = req.body.phone;
  console.log('home private route');
  res.status(202).send({ message: 'Private Protected Route - Otp Home' });
});

const APIKEY = 'fda7bc0b-20f9-11e7-929b-00163ef91450';
otpRouter.post(
  '/sendOtp',
  expressAsyncHandler(async (req, res) => {
    const phone = req.body.phone;
    try {
      await axios
        .get(
          `http://2factor.in/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450-t/SMS/${phone}/AUTOGEN/educheck_otp`, //${APIKEY}
          {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {},
          }
        )
        .then(function (body) {
          console.log(body);
        })
        .catch(function (error) {
          console.log(error);
        });
      res.status(200).send({ message: 'Otp Send' });
    } catch (error) {
      console.log(error);
    }
  })
);

otpRouter.post(
  '/verifyOtp',
  expressAsyncHandler(async (req, res) => {
    const session_id = req.body.session_Id;
    const otp = req.body.otp;
    try {
      await axios
        .get(
          `http://2factor.in/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450-t/SMS/VERIFY/${session_id}/${otp}`,
          {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {},
          }
        )
        .then(function (body) {
          console.log(body);
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(res);
      res.status(200).send({ message: 'OTP Matched' });
    } catch (error) {
      console.log(error);
      res.status(200).send({ message: 'OTP not Matched' });
    }
  })
);

export default otpRouter;
