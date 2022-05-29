import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

const otpRouter = express.Router();

// API to send OTP on given mobile no.
otpRouter.post(
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
otpRouter.post(
    '/verifyOTP',
    expressAsyncHandler(async (req, res) => {
        const otp = req.body.otp;
      var request = require('request');
      var options = {
        method: 'GET',
        url: `http://2factor.in/API/V1/fda7bc0b-20f9-11e7-929b-00163ef91450/SMS/VERIFY/e47c3993-5830-4b09-8665-360de42e30f2/${otp}`,
        //   https://2factor.in/API/V1/{api_key}/SMS/VERIFY/{session_id}/{otp_input}
        // 753325
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {},
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
  
        console.log(body);
      });
      res.status(200).send({ phone, details }, { message: 'OTP Matched' });
    })
  );


export default otpRouter;