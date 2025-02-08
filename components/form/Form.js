"use client";
import { Layout, Table, message, Modal } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [userResponses, setUserResponses] = useState([]);

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
    
        if (response.data.users && response.data.users.length > 0) {
          const userData = response.data.users[0];
          const formattedData = [
            {
              key: userData._id,
              index: 1,
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

  const fetchUserResponses = async (userId) => {
    try {
      const response = await Axios.get(`http://3.108.237.132:3001/api/response/user/${userId}`);
      if (response.data.responses && response.data.responses.length > 0) {
        setUserResponses(response.data.responses);
        setModalVisible(true);
      } else {
        message.info("No responses found for this user.");
      }
    } catch (error) {
      console.error("Error fetching user responses:", error);
      message.error("Error fetching user responses.");
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4">
          {/* <EditOutlined
            className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
            onClick={() => router.push(`/manage-data`)}
          /> */}
          <EyeOutlined
            className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
            onClick={() => fetchUserResponses(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <HeaderComponent />
        <Content className="p-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-black mb-6">User List</h1>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} loading={loading} />
        </Content>
      </Layout>
      <Modal
      title={
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-t-md text-xl font-semibold">
          User Submitted Data
        </div>
      }
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      className="rounded-lg shadow-xl"
    >
      <div className="p-4 bg-gray-50 rounded-b-md">
        {userResponses.length > 0 ? (
          userResponses.map((response, index) => (
            <div
              key={response._id}
              className="mb-4 p-4 border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                Response {index + 1}
              </h3>
              <div className="mt-2 space-y-2">
                {response.answers.map((answer) => (
                  <p key={answer._id} className="text-gray-700">
                    <strong className="text-gray-900">{answer.question}:</strong>{" "}
                    {answer.answer}
                  </p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No responses available.</p>
        )}
      </div>
    </Modal>
    </Layout>
  );
};

export default Form;
