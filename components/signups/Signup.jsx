"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { message, Modal } from "antd";

const Signup = () => {
  const [mobileno, setMobileno] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const [sessionId, setSessionId] = useState("");
  const router = useRouter();

  // Phone number validation
  const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(mobileno)) {
      message.error("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileno }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Signup successful! Please verify OTP.");
        setSessionId(data.sessionId);  // Get the session ID
        setIsModalVisible(true);  // Show OTP modal
      } else {
        message.error(data.message || "Signup failed");
      }
    } catch (error) {
      message.error("Error during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      message.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/user/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileno,
          sessionId,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("OTP verified successfully!");
        setIsModalVisible(false);
        router.push("/");
      } else {
        message.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      message.error("Error during OTP verification. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-800">Phone Number</label>
            <input
              type="text"
              value={mobileno}
              onChange={(e) => setMobileno(e.target.value)}
              className="mt-2 p-4 w-full border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
            {/* Divider for better UI */}
            <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-600 text-sm font-medium">Already have an account?</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Login Button */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 text-lg font-semibold text-indigo-600 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* OTP Modal */}
        <Modal
          title="Verify OTP"
          open={isModalVisible} // Use 'open' instead of 'visible'
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                maxLength="1"
              />
            ))}
          </div>
          <button
            onClick={handleOtpSubmit}
            className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Verify OTP
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;
