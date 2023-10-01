const mongoose = require("mongoose")
// const colors = require("colors")

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected ${mongoose.connection.host}`)
    }
    catch(error){
        console.log(`Mongo Server Issue ${error}`)
    }
}

module.exports = connectDB;