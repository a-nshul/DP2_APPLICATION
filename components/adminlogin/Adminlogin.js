"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { message, Input } from "antd";
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";
import "@ant-design/v5-patch-for-react-19";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://3.108.237.132:3001/api/admin/login", {
        email,
        password,
      });

      if (response.data.token) {
        message.success("Login successful!");
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        router.push("/admin/dashboard");
      } else {
        message.error("Invalid credentials, please try again.");
      }
    } catch (error) {
      message.error("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefix={<UserOutlined className="text-gray-500" />}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockOutlined className="text-gray-500" />}
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined className="cursor-pointer text-gray-500" onClick={() => setShowPassword(false)} />
                ) : (
                  <EyeOutlined className="cursor-pointer text-gray-500" onClick={() => setShowPassword(true)} />
                )
              }
              className="mt-2 p-2 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Button */}
        <button
          onClick={() => router.push("/admin-signup")}
          className="w-full mt-4 py-3 text-lg font-semibold text-indigo-600 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
