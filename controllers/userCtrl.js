const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel')

const registerController = async(req, res) => {
    try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message: `User already exists`, success:false})
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({message:'Register Sucessfully', success:true})
    } catch(error){
        console.log(error)
        res.status(500).send({success:false, message: `Register Controller ${error.message}`})
    }
};
const loginController = async(req, res) => {
    try{
        const user = await userModel.findById({email:req.body.email})
        if(!user){
            return res.status(200).send({message: 'user not found', success:false})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(isMatch){
            return res.status(200).send({message:'Invalid email or password', success:false})
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.status(200).send({message: 'Login Success', success:true, token})

    } catch(error){
        console.log(error)
        res.status(500).send({message:`Error in login ctrl ${error.message}`})
    }
}

const authController = async(req, res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId})
        user.password = undefined
        if(!user){
            return res.status(200).send({message: 'user not found', success:false})
        }
        else{
            res.status(200).send({
                success: true,
                data: user
            })
        }

    } catch(error){
        console.log(error)
        res.status(500).send({message:`Error in auth ctrl ${error.message}`, success:false, error})
    }
}

const applyDoctorController = async(req, res) => {
    try{
        const newDoctor = await doctorModel({...req.body, status:'pending'})
        await newDoctor.save()
        const adminUser = await userModel.findOne({isAdmin: true})
        const notification = adminUser.notification
        notification.push({
            type:'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data:{
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, {notification})
        res.status(201).send({
            succes:true,
            messaage: 'Doctor account applied successfully'
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while applying for doctor'
        })
    }
}


const getAllNotificationController = async(req,res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId})
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification = []
        user.seennotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success:true,
            message:'All notification marked as read',
            data : updatedUser,
        })
    }catch(error){
        console.log(error)
        res.status.send({
            message: "Error in notification",
            success: false,
            error
        })
    }
  }

  //delete notifications
  const deleteAllNotificationController = async(req,res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId})
        user.notification = []
        user.seennotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success:true,
            message:'All notification deleted successfully',
            data : updatedUser,
        })
    }catch(error){
        console.log(error)
        res.status.send({
            message: "Unable to delete all notifications",
            success: false,
            error
        })
    }
  }

module.exports = {loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController,}