const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    firstName:{
        type:String,
        requires:[true, 'first name is required']
    },
    lastName:{
        type:String,
        required:[true, 'last name is required']
    },
    phone:{
        type:String,
        required:[true, 'phone no is required']
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true, 'address is required']
    },
    specialization:{
        type:String,
        required:[true, 'specialization is required']
    },
    experience:{
        type:String,
        required:[true, 'experience is required']
    },
    fees:{
        type:String,
        required:[false, 'fees is required']
    },
    status:{
        type:String,
        default:'Pending'
    },
    timings:{
        type:Object,
        required:[true, 'work timing is required']
    }
}, {timestamps:true})

const doctorModel = mongoose.model('doctors', doctorSchema)
module.exports = doctorModel