"use client";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  FormOutlined,
  DatabaseOutlined
} from "@ant-design/icons";
import Link from "next/link";
import React, { useState } from "react";
import '@ant-design/v5-patch-for-react-19';
const { Sider } = Layout;
import { useRouter } from "next/navigation";

const AdminSidebar = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user-login");
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="h-screen bg-gray-800 text-white" width={250}>
      <div className="flex justify-center py-4">
        <img
          src="https://play-lh.googleusercontent.com/_vY8yiP_cn7T7dH8iXQtJDZc4C7f4exDmvmVOWYVQgT-Z7AdVBwb037ACFqBu6qEaZ0"
          alt="Logo"
          className="w-16 h-16"
        />
      </div>

      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link href="/admin-user">User Management</Link>
        </Menu.Item>

        <Menu.SubMenu key="2" icon={<DatabaseOutlined />} title="People Data Management">
          <Menu.Item key="2-1" icon={<PlusOutlined />}>
            <Link href="/admin-user/add-data">Add Data</Link>
          </Menu.Item>
          <Menu.Item key="2-2" icon={<SettingOutlined />}>
            <Link href="/admin-user/manage-data">Manage Data</Link>
          </Menu.Item>
          <Menu.Item key="2-3" icon={<AppstoreAddOutlined />}>
            <Link href="/admin-user/add-category">Add Data Category</Link>
          </Menu.Item>
          <Menu.Item key="2-4" icon={<UnorderedListOutlined />}>
            <Link href="/admin-user/manage-category">Manage Data Category</Link>
          </Menu.Item>
          <Menu.Item key="2-5" icon={<FormOutlined />}>
            <Link href="/admin-user/add-field">Add Data Field</Link>
          </Menu.Item>
          <Menu.Item key="2-6" icon={<SettingOutlined />}>
            <Link href="/admin-user/manage-field">Manage Data Field</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-4">
        <Menu mode="inline">
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
