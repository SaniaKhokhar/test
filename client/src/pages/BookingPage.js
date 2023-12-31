import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker, message } from "antd";
// import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import dayjs from "dayjs";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Booking Function =====/////
  const handleBooking = async () => {
    try {
        setIsAvailable(true)
        if(!date && !time){
            return alert("Date and time required")
        }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          userInfo: user,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  //===
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        {
          doctorId: params.doctorId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true)
        console.log(isAvailable)
        message.success(res.data.message);
      }else{
        message.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading(true));
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h3>BookingPage</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.fees} </h4>
            <h4>
            Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </h4>

            <div className="d-flex flex-column w-50">
              <DatePicker
               aria-required={"true"}
                format="DD-MM-YYYY"
                onChange={(value) => {
                    setIsAvailable(false)
                    setDate(dayjs(value).format("DD-MM-YYYY"))}
                }
              />
              <TimePicker
                format="HH:MM"
                onChange={(value) => { 
                    setIsAvailable(false)
                  setTime(dayjs(value).format("HH:MM"),
                    // dayjs(value[1]).format("HH:MM"),
                  )}                    
                }
              />
              <button className="btn btn-primary mt-2" onClick={handleAvailability}>
                Check Availability
              </button>
              {/* {!isAvailable && ( */}
                <button className="btn btn-dark mt-2" onClick={handleBooking}>
                    Book Now
                </button>
              {/* )} */}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
