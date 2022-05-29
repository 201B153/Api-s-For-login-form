import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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
    res.json({success: 'otp verified successfully', url: req.url})
  })
);
// API to call for singin form
app.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);
//API to call-for Signup-form .
app.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);
// API to call for Profile 
userRouter.put(
  '/profile',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not Found' });
    }
  })
);

app.post(
  '/home',
  expressAsyncHandler(async (req, res) => {
    console.log('home private route');
    res.status(202).send('Private Protected Route - Home');
  })
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
