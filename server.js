const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/db");
const morgan = require('morgan');

dotenv.config()

//mongodb connection
connectDB();

//rest object
const app = express()

//middlewares
app.use(express.json())
app.use(morgan("dev"))

//routes
app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/admin',require('./routes/adminRoutes'))
app.use('/api/v1/doctor',require('./routes/doctorRoutes'))

//port
const port = process.env.PORT || 3000


//listen port
app.listen(port, () =>{
    console.log(`Server running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`)
})