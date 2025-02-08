"use client";
import { Layout, Menu } from "antd";
import { 
  UserOutlined, 
  LogoutOutlined, 
  DatabaseOutlined 
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import "@ant-design/v5-patch-for-react-19";

const { Sider } = Layout;

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState(pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user-login");
  };

  return (
    <Sider className="h-screen bg-gray-900 text-white" width={260}>
      {/* Logo Section */}
      <div className="flex justify-center py-6">
        <img 
          src="https://play-lh.googleusercontent.com/_vY8yiP_cn7T7dH8iXQtJDZc4C7f4exDmvmVOWYVQgT-Z7AdVBwb037ACFqBu6qEaZ0" 
          alt="Logo" 
          className="w-20 h-20 rounded-full border-4 border-gray-700 shadow-lg"
        />
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        className="bg-gray-900 text-gray-300 text-lg"
        onClick={(e) => setSelectedKey(e.key)}
      >
        <Menu.Item key="/user" icon={<UserOutlined className="text-xl" />}>
          <Link href="/user" className="w-full block">Our Profile</Link>
        </Menu.Item>

        <Menu.Item key="/data" icon={<DatabaseOutlined className="text-xl" />}>
          <Link href="/manage-data" className="w-full block">Manage Data</Link>
        </Menu.Item>
      </Menu>

      {/* Logout Button */}
      <div className="absolute bottom-6 w-full px-6">
        <Menu 
          mode="inline" 
          className="bg-gray-900 text-white text-lg font-semibold"
        >
          <Menu.Item 
            key="logout" 
            icon={<LogoutOutlined className="text-3xl text-white" />} 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-all"
          >
            <span className="text-xl text-white">Logout</span>
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
};

export default Sidebar;
