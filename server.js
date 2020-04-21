// The requirements for the server
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
// const clarifai = require('clarifai');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Boris',
    database : 'smartbrain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

//creating app by running express
const app = express();

app.use(cors());
//tell to use bodyparser
app.use(bodyParser.json());



// Base route
app.get('/', (req, res) => { res.send(database.users) })

// All endpoint in file controllers to clean op code in server.js

// Signin
// Other way of running. Bit more advanced req, res is run in sigin.js
app.post('/signin', signin.handleSignin(db, bcrypt))

// Register. Regestring new users and loging their credentials into the register/login db using trx instead of db 
// It also gets after creating a controllers folder a dependicies injection
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// Profile and ID (for future purposes)
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

// Image
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3001, () => {
	console.log('App is running on port 3001'); // extra log to see if app is running
})

