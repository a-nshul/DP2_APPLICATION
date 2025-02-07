"use client";
import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { message } from "antd";
import axios from "axios";
import { MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

function AdminSignup() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://3.108.237.132:3001/api/admin/signup", formData);

      console.log("API Response:", res.data); // Debugging

      if (res.data.token) {
        message.success(res.data.message || "Signup successful!");
        localStorage.setItem("token", res.data.token); // Store token if needed
        setTimeout(() => router.push("/admin-login"), 1000); // Redirect after success
      } else {
        message.error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      message.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">Admin Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <div className="flex items-center mt-2 p-4 w-full border border-gray-300 rounded-md">
              <MailOutlined className="mr-2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none text-black"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <div className="flex items-center mt-2 p-4 w-full border border-gray-300 rounded-md">
              <LockOutlined className="mr-2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none text-black"
                placeholder="Enter password"
                required
              />
              {showPassword ? (
                <EyeInvisibleOutlined
                  className="ml-2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeOutlined
                  className="ml-2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md transition duration-300 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Back to Login Button */}
          <button
            type="button"
            onClick={() => router.push("/admin-login")}
            className="w-full py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-md mt-4 transition duration-300 hover:bg-gray-300"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;
