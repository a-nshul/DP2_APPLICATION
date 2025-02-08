"use client";
import { Layout, Table } from "antd";
import Sidebar from "../AdminSidebar";
import HeaderComponent from "../Header";
import '@ant-design/v5-patch-for-react-19';

const { Content } = Layout;

const Form = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <HeaderComponent />
        <Content className="p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black">User List</h1>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Form;
