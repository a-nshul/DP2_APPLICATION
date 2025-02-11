"use client";
import { Layout, Table, message, Modal, Input, Button } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
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
  const [editMode, setEditMode] = useState(null);
  const [editedResponse, setEditedResponse] = useState({});

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

  const handleEdit = (response) => {
    setEditMode(response._id.toString());
    setEditedResponse(response);
  };
  

  const handleSaveEdit = async () => {
    try {
      if (!editMode) {
        message.error("No response selected for editing.");
        return;
      }
  
      const responseId = editMode.toString(); // Ensure it's a string
  
      // Ensure _id inside updatedResponse is a valid ObjectId
      const formattedResponse = { ...editedResponse, _id: responseId };
  
      await Axios.put(`http://3.108.237.132:3001/api/response/update/${responseId}`, formattedResponse);
  
      message.success("Response updated successfully!");
      setUserResponses((prev) =>
        prev.map((res) => (res._id === editMode ? editedResponse : res))
      );
      setEditMode(null);
    } catch (error) {
      console.error("Error updating response:", error);
      message.error("Failed to update response.");
    }
  };
  
  

  const handleDelete = async (responseId) => {
    try {
      await Axios.delete(`http://3.108.237.132:3001/api/response/delete/${responseId}`);

      message.success("Response deleted successfully!");
      setUserResponses((prev) => prev.filter((res) => res._id !== responseId));
    } catch (error) {
      console.error("Error deleting response:", error);
      message.error("Failed to delete response.");
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
          <EyeOutlined
            className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
            onClick={() => fetchUserResponses(record.key?.toString())}
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
                {editMode === response._id ? (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">Edit Response</h3>
                    {response.answers.map((answer, idx) => (
                      <div key={answer._id} className="mb-2">
                        <strong className="text-gray-900">{answer.question}:</strong>
                        <Input
                          value={editedResponse.answers[idx].answer}
                          onChange={(e) => {
                            const updatedAnswers = [...editedResponse.answers];
                            updatedAnswers[idx].answer = e.target.value;
                            setEditedResponse({ ...editedResponse, answers: updatedAnswers });
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">Response {index + 1}</h3>
                    <div className="mt-2 space-y-2">
                      {response.answers.map((answer) => (
                        <p key={answer._id} className="text-gray-700">
                          <strong className="text-gray-900">{answer.question}:</strong> {answer.answer}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-3 mt-3">
                      <EditOutlined
                        className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
                        onClick={() => handleEdit(response)}
                      />
                      <DeleteOutlined
                        className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                        onClick={() => handleDelete(response._id)}
                      />
                    </div>
                  </div>
                )}
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
