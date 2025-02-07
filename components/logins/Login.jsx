"use client";
import { useState } from "react";
import '@ant-design/v5-patch-for-react-19';
import { useRouter } from "next/navigation";
import { message } from "antd"; 
import axios from "axios"; 

const Login = () => {
  const [mobileno, setMobileno] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); 
  const [otp, setOtp] = useState(["", "", "", "" ,"",""]);
  const [sessionId, setSessionId] = useState("");
  const router = useRouter();

  // Phone number validation function
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/; 
    return phoneRegex.test(number);
  };

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
  
    if (!/^[0-9]?$/.test(value)) return; // Allow only single digit numbers
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    // Move focus to next input box if current input is filled
    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  
  // Handle backspace key to move focus to previous box
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number before submitting
    if (!validatePhoneNumber(mobileno)) {
      message.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://3.108.237.132:3001/api/user/login", { mobileno });

      // Check if response is successful and sessionId exists
      if (response.data.sessionId) {
        message.success("OTP sent successfully");
        setSessionId(response.data.sessionId); // Set sessionId from response
        setIsVerified(true); // OTP sent, show OTP input
      } else {
        message.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      message.error("Error during login. Please try again.");
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
      const response = await axios.post("http://3.108.237.132:3001/api/user/login/verify", {
        mobileno,
        sessionId, // Include sessionId in the request
        otp: otpCode,
      });
  
      console.log("Response from server:", response.data); 
  
      if (response.data.token && response.data.user?._id) { 
        message.success("OTP verified successfully!");
        // Store token in localStorage or cookies for session management
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userId", response.data.user._id); 
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        router.push("/user"); // Redirect to form_builder page on success
      } else {
        message.error("OTP verification failed. Please try again.");
      }
    } catch (error) {
      message.error("Error during OTP verification. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">{isVerified ? 'Verify OTP' : 'Login'}</h2>
        
        {/* Show login form or OTP input based on verification status */}
        {!isVerified ? (
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <button
              type="submit"
              className={`w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            {/* Divider for better UI */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-600 text-sm font-medium">Don't have an account?</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <button
              onClick={() => router.push('/signup')}
              className="w-full py-3 text-lg font-semibold text-indigo-600 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 mt-4"
            >
              Sign Up
            </button>
          </form>
        ) : (
          // OTP Verification Form
          <div>
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                // <input
                //   key={index}
                //   type="text"
                //   value={digit}
                //   onChange={(e) => handleOtpChange(e, index)}
                //   className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                //   maxLength="1"
                // />
                <input
                  key={index}
                  id={`otp-${index}`} // Unique ID for each input
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
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
          </div>
        )}
        <button
          onClick={() => router.push('/')}
          className="w-full mt-4 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Login;
