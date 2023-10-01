import React from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  //handle read notification
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading);
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        {
          userId: user._id,
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
        window.location.reload()
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  //delete notification
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading);
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload()
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <h4 className="p-3 text-center">NotificationPage</h4>
      <Tabs>
        <items tab="unRead" key={0}>
          <div className="d-flex justify-content-end">
            <h4 className="p-2" onClick={handleMarkAllRead}>
              Mark all read{" "}
            </h4>
          </div>
          {user && user.notification.map((notificationMsg) => (
          
          <div className="card" style={{ cursor: "pointer" }}>
            <div
              className="card-text"
              onClick={() => navigate(notificationMsg.onClickPath)}
            >
              {notificationMsg.message}
            </div>
          </div>
        ))}
        </items>
        <items tab="Read" key={1}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2 text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteAllRead}
            >
              Delete all read{" "}
            </h4>
          </div>
          {user && user.seennotification.map((notificationMsg) => (
          
            <div className="card" style={{ cursor: "pointer" }}>
              <div
                className="card-text"
                onClick={() => navigate(notificationMsg.onClickPath)}
              >
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </items>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
