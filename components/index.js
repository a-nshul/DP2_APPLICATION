"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import '@ant-design/v5-patch-for-react-19';

const Index = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white p-14 rounded-3xl shadow-2xl w-96 text-center">
        <h2 className="text-4xl font-bold text-gray-700 mb-10">Login</h2>

        <Button
          type="primary"
          className="w-full mb-8 text-xl py-5 rounded-2xl transition-all bg-gradient-to-r from-indigo-600 to-indigo-700 
                     hover:from-indigo-500 hover:to-indigo-600 shadow-lg hover:shadow-xl"
          onClick={() => router.push("/admin-login")}
        >
          Login as ADMIN
        </Button>

        <Button
          type="primary"
          className="w-full text-xl py-5 rounded-2xl transition-all bg-gradient-to-r from-purple-600 to-purple-700 
                     hover:from-purple-500 hover:to-purple-600 shadow-lg hover:shadow-xl"
          onClick={() => router.push("/user-login")}
        >
          Login as USER
        </Button>
      </div>
    </div>
  );
};

export default Index;
