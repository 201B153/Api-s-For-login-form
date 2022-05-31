import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import otpRouter from './routes/otpRouter.js';
// import expressAsyncHandler from 'express-async-handler';

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

const users = [
  { id: 1, name: 'user1' },
  { id: 2, name: 'user2' },
  { id: 3, name: 'user3' },
];

app.get('/', function (req, res) {
  //when we get an http get request to the root/homepage
  console.log('home private route');
  res.send('Hello World 201b153');
});

//when we route to /user
app.get('/user', function (req, res) {
  res.send(users); //respond with the array of users
});

app.get('/user/:id', function (req, res) {
  const user = users.find((c) => c.id === parseInt(req.params.id));
  //if the user does not exist return status 404 (not found)
  if (!user)
    return res.status(404).send('The user with the given id was not found');
  //return the object
  res.send(user);
});

//using the http post request we can create a new user
app.post('/user', function (req, res) {
  //create a user object
  const user = {
    id: users.length + 1,
    name: req.body.name,
  };
  //add the user to the array
  users.push(user);
  //return the user
  res.send(user);
});

app.put('/users/:id', function (req, res) {
  //get the user
  const user = users.find((c) => c.id === parseInt(req.params.id));
  if (!user)
    return res.status(404).send('The user with the given id was not found');
  //update the user
  user.name = req.body.name;
  //return the updated object
  res.send(user);
});

app.put('/users/:id', function (req, res) {
  //get the user
  const user = courses.find((c) => c.id === parseInt(req.params.id));
  if (!user)
    return res.status(404).send('The user with the given id was not found');
  //update the user
  course.name = req.body.name;
  //returns the updated object
  res.send(user);
});

app.use('/api/users', userRouter);

app.use('/api/otp', otpRouter);

app.post('/home', async (req, res) => {
  console.log('home private route');
  res.status(202).send('Private Protected Route - Home');
});
app.get('/home', async (req, res) => {
  console.log('home private route');
  res.status(202).send('Private Protected Route - Home');
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
