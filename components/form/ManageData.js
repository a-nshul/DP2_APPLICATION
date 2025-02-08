"use client";
import { Layout, Table, message, Modal, Form, Input, Button, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Sidebar from "../Sidebar";
import HeaderComponent from "../Header";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;

const ManageData = () => {
  const router = useRouter();
  const [formFields, setFormFields] = useState([]);
  const [userResponses, setUserResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);

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

        // Fetch existing fields
        const response = await Axios.get(
          `http://3.108.237.132:3001/api/user/getprofile/${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.user) {
          setFormFields(response.data.user.fields || []);
        } else {
          message.error("User profile not found.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Error fetching user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Open modal for adding/editing a field
  const handleEdit = (index = null) => {
    setSelectedFieldIndex(index);
    form.setFieldsValue(index !== null ? formFields[index] : { label: "", type: "text" });
    setIsModalOpen(true);
  };

  // Save or update a field
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let updatedFields = [...formFields];

      if (selectedFieldIndex !== null) {
        updatedFields[selectedFieldIndex] = values;
      } else {
        updatedFields.push(values);
      }

      setFormFields(updatedFields);
      setIsModalOpen(false);
      await updateProfile(updatedFields);
    } catch (error) {
      console.error("Error saving field:", error);
    }
  };

  // Delete a field
  const handleDelete = async (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    await updateProfile(updatedFields);
  };

  // Update profile API (fields)
  const updateProfile = async (fields) => {
    try {
      const token = localStorage.getItem("token");
      await Axios.put(
        `http://3.108.237.132:3001/api/user/updateprofile/${userId}`,
        { userId, fields },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Error updating profile.");
    }
  };

  // Handle input change for responses
  const handleInputChange = (label, value) => {
    setUserResponses({ ...userResponses, [label]: value });
  };

  // Submit user responses API
  const submitResponses = async () => {
    try {
      const token = localStorage.getItem("token");
      const answers = Object.keys(userResponses).map((key) => ({
        question: key,
        answer: userResponses[key],
      }));

      const response = await Axios.post(
        `http://3.108.237.132:3001/api/response/submit`,
        { userId, answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.message) {
        message.success(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
      message.error("Error submitting responses.");
    }
  };

  const columns = [
    { title: "Label", dataIndex: "label", key: "label" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <div className="flex gap-4">
          <EditOutlined className="text-blue-600 cursor-pointer" onClick={() => handleEdit(index)} />
          <DeleteOutlined className="text-red-600 cursor-pointer" onClick={() => handleDelete(index)} />
        </div>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full flex flex-col">
        <HeaderComponent title="Dynamic Form Builder" />
        <Content className="p-6 overflow-auto h-screen">
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => handleEdit()} className="mb-4">
            Add Field
          </Button>
          <Table columns={columns} dataSource={formFields} loading={loading} rowKey="label" bordered />

          {/* Response Form */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4">Submit Your Responses</h2>
            <Form layout="vertical">
              {formFields.map((field) => (
                <Form.Item key={field.label} label={field.label}>
                  <Input
                    type={field.type}
                    placeholder={`Enter your ${field.label}`}
                    value={userResponses[field.label] || ""}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                </Form.Item>
              ))}
              <Button type="primary" onClick={submitResponses} className="mt-2">
                Submit Responses
              </Button>
            </Form>
          </div>

          {/* Field Modal */}
          <Modal
            title={selectedFieldIndex !== null ? "Edit Field" : "Add Field"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleSave}>
                Save
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical">
              <Form.Item label="Label" name="label" rules={[{ required: true, message: "Label is required" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="text">Text</Select.Option>
                  <Select.Option value="email">Email</Select.Option>
                  <Select.Option value="number">Number</Select.Option>
                  <Select.Option value="password">Password</Select.Option>
                  <Select.Option value="date">Date</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </div>
    </Layout>
  );
};

export default ManageData;
