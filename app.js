const express = require('express')
const { dbConnection } = require('./config/db.config')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000
const cookieParser = require('cookie-parser');
const cors = require('cors');

// import routes
const userRouter = require('./routes/userRoutes')

// Middlewares
app.use(
    cors({
      origin: ['http://localhost:3000', 'https://home-service-beige.vercel.app'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
  );
  
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World'))

app.use('/api/user', userRouter)


dbConnection()
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))