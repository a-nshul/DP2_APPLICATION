"use client";
import React from "react";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import '@ant-design/v5-patch-for-react-19';
const { Header } = Layout;
// import { useRouter } from "next/navigation";
const HeaderComponent = () => {
  // const router = useRouter();
  const handleMenuClick = (e) => {
    if (e.key === "profile") {
      // Navigate to profile update page
      console.log("Update Profile");
      // router.push(`/edit-user?id=${recordKey}`);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<EditOutlined />}>
        Update Profile
      </Menu.Item>
      {/* Add more menu items here if needed */}
    </Menu>
  );

  return (
    <Header className="bg-white shadow-md flex justify-between items-center px-6">
      <div className="text-xl font-semibold">DP2</div>
      <div className="flex items-center space-x-4">
        <Dropdown overlay={menu} trigger={['click']}>
          <Avatar icon={<UserOutlined />} className="cursor-pointer" />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
