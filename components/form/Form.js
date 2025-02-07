"use client";
import { Layout, Table, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Sidebar from "../Sidebar";
import HeaderComponent from "../Header";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { useEffect, useState } from "react";
import '@ant-design/v5-patch-for-react-19';

const { Content } = Layout;

const Form = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          message.error("User ID not found. Please log in again.");
          return;
        }
        setUserId(storedUserId);
    
        const response = await Axios.get(
          `http://3.108.237.132:3001/api/user/getprofile?id=${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        // ✅ Check if `users` array exists and has data
        if (response.data.users && response.data.users.length > 0) {
          const userData = response.data.users[0]; // Get first user object
    
          const formattedData = [
            {
              key: userData._id,
              index: 1,
              name: userData.personalDetails?.fullName || "N/A",
              email: userData.contactInformation?.email || "N/A",
              phone: userData.mobileno || "N/A",
            },
          ];
          setData(formattedData);
        } else {
          message.error("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const columns = [
    {
      title: <span className="text-gray-700 font-semibold text-lg">S.No</span>,
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => <span className="text-gray-600">{index + 1}</span>,
    },
    {
      title: <span className="text-gray-700 font-semibold text-lg">Name</span>,
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-black font-medium">{text}</span>,
    },
    {
      title: <span className="text-gray-700 font-semibold text-lg">Email</span>,
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: <span className="text-gray-700 font-semibold text-lg">Phone Number</span>,
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: <span className="text-gray-700 font-semibold text-lg">Action</span>,
      key: "action",
      render: (_, record) => (
        <EditOutlined
          className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg transition-colors duration-200 ease-in-out"
          onClick={() => router.push(`/edit-user?id=${record.key}`)}
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <HeaderComponent />
        <Content className="p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black">User List</h1>
          </div>
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{ pageSize: 5 }} 
            loading={loading} 
            className="shadow-lg rounded-lg overflow-hidden"
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Form;
