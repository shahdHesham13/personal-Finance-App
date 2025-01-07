const express = require('express');
//const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./src/db/connect.js');
const {readdirSync} = require('fs')
const cookieParser = require('cookie-parser')
const errorHandler = require('./src/middleware/errorhandler.js');
const userRoutes = require('./src/routes/userRoutes.js');

require('dotenv').config();
const app = express()

const PORT = process.env.PORT || 5000;

//console.log('Mongo URI:', process.env.MONGO_URI);


//middlewares
app.use(express.json())
//app.use(cors())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Routes
app.use('/api/v1/users', userRoutes);


// Load userRoutes.js explicitly first
//app.use('/api/v1/users', require('./src/routes/userRoutes.js'));


// Then load the rest dynamically
readdirSync('./src/routes').forEach((route) => {
  if (route !== 'userRoutes.js') {
    app.use('/api/v1', require('./src/routes/' + route));
  }
});

// Start server
const server = async () => {
  try {
    await connect();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Failed to start server', error.message);
    process.exit(1);
  }
};

server();