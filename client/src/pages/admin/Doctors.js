import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../../components/Layout";
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  //get Doctors
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle account status
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    getDoctors();
  }, []);

  //antD table col
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return <span>
          {record.firstName} {record.lastName}
        </span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button className="btn btn-danger">Reject</button>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1>All Doctors</h1>
      <Table columns={columns} dataSource={doctors}/>
          </Layout>
  );
};

export default Doctors;
