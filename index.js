const express = require('express')
const { dbConnection } = require('./config/db.config')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000

// import routes
const userRouter = require('./routes/userRoutes')

app.use('/api/user', userRouter)


dbConnection()
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))