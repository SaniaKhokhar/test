const express = require('express')
const { loginController, 
    registerController,
authController,
applyDoctorController,
getAllNotificationController,
deleteAllNotificationController,
bookAppointmentController,
bookingAvailabilityController,
userAppointmentController, 
 } = require('../controllers/userCtrl')

 const authMiddleware = require("../middlewares/authMiddleware")
const { getAllDoctorsController } = require('../controllers/adminCtrl')

//router object
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login',loginController)

//REGISTER || POST
router.post('/register', registerController)

//Auth || POST
router.post("/getUserData", authMiddleware, authController)

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController)

//Notification Doctor  || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController)

//Notification Doctor  || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController)

//GET ALL DOCTORS
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)

//BOOK APPOINTMENT
router.post('/book-appointment',authMiddleware, bookAppointmentController)

//Booking Availability
router.post('/booking-availability',authMiddleware, bookingAvailabilityController)


//Appointment list
router.get('/user-appointments',authMiddleware,userAppointmentController)
module.exports = router