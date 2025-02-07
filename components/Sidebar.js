"use client";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import React from "react";
import '@ant-design/v5-patch-for-react-19';
const { Sider } = Layout;
import { useRouter } from "next/navigation";
const Sidebar = () => {
  const router = useRouter();
  const handlelogout = () => {
    localStorage.removeItem("token");
    router.push("/user-login");
  };
  return (
    <Sider className="h-screen bg-gray-800 text-white" width={250}>
      <div className="flex justify-center py-4">
        <img src="https://play-lh.googleusercontent.com/_vY8yiP_cn7T7dH8iXQtJDZc4C7f4exDmvmVOWYVQgT-Z7AdVBwb037ACFqBu6qEaZ0" alt="Logo" className="w-16 h-16" />
      </div>

      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link href="/user">See profile</Link>
        </Menu.Item>
        {/* <Menu.Item key="1" icon={<UserOutlined />}>
          <Link href="/user">Users</Link>
        </Menu.Item> */}
      </Menu>

      <div className="absolute bottom-0 w-full p-4">
        <Menu mode="inline">
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handlelogout}>
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
};

export default Sidebar;
