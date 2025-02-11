"use client";
import React, { useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Menu, Modal, Button, Spin, message, Input, Tooltip } from "antd";
import { UserOutlined, EditOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import '@ant-design/v5-patch-for-react-19';

const { Header } = Layout;

const HeaderComponent = () => {
  const [userId, setUserId] = useState(""); // Store User ID
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiData, setApiData] = useState({ apiKey: "", secretKey: "" });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({ apiKey: false, secretKey: false });

  // Get User ID from localStorage when the component loads
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      message.error("User ID not found. Please log in again.");
    }
  }, []);

  // Function to fetch API Key & Secret Key
  const fetchApiKeys = async () => {
    if (!userId) {
      message.error("User ID is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://3.108.237.132:3001/api/user/getprofile/${userId}`);
      console.log("API Response:", response.data); // Debugging log

      if (response.data && response.data.user) {
        setApiData({
          apiKey: response.data.user.apiKey || "Not Available",
          secretKey: response.data.user.secretKey || "Not Available",
        });
      } else {
        message.error("Invalid API response");
      }
    } catch (error) {
      message.error("Failed to fetch API keys");
      console.error("Error fetching API keys:", error);
    }
    setLoading(false);
  };

  // Show Modal and fetch API keys
  const showModal = () => {
    fetchApiKeys();
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Copy to Clipboard
  const copyToClipboard = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied({ ...copied, [key]: true });

    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 1500);
  };

  // Handle Menu Click
  const handleMenuClick = (e) => {
    if (e.key === "profile") {
      showModal();
    }
  };

  // Dropdown Menu
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<EditOutlined />}>
       Show api key
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="bg-white shadow-md flex justify-between items-center px-6">
        <div className="text-xl font-semibold">DP2</div>
        <div className="flex items-center space-x-4">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar icon={<UserOutlined />} className="cursor-pointer" />
          </Dropdown>
        </div>
      </Header>

      {/* Modal for API Key & Secret Key */}
      <Modal
        title="API Credentials"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel} className="bg-gray-500 text-white hover:bg-gray-700">
            Close
          </Button>,
        ]}
      >
        {loading ? (
          <div className="flex justify-center py-6">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* API Key Section */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">API Key:</label>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow">
                <Input
                  className="bg-gray-100 border-none text-gray-900 font-medium"
                  value={apiData.apiKey}
                  readOnly
                />
                <Tooltip title={copied.apiKey ? "Copied!" : "Copy"}>
                  <Button
                    icon={copied.apiKey ? <CheckOutlined className="text-green-500" /> : <CopyOutlined />}
                    onClick={() => copyToClipboard("apiKey", apiData.apiKey)}
                    className="hover:bg-gray-200"
                  />
                </Tooltip>
              </div>
            </div>

            {/* Secret Key Section */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Secret Key:</label>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow">
                <Input
                  className="bg-gray-100 border-none text-gray-900 font-medium"
                  value={apiData.secretKey}
                  readOnly
                />
                <Tooltip title={copied.secretKey ? "Copied!" : "Copy"}>
                  <Button
                    icon={copied.secretKey ? <CheckOutlined className="text-green-500" /> : <CopyOutlined />}
                    onClick={() => copyToClipboard("secretKey", apiData.secretKey)}
                    className="hover:bg-gray-200"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default HeaderComponent;
