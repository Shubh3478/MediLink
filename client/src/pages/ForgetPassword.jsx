import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      await toast.promise(
        axios.post("/user/send-otp", { email }),
        {
          loading: "Sending OTP...",
          success: "OTP sent successfully",
          error: "Failed to send OTP",
        }
      );

      navigate("/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Forgot Password</h2>
        <form onSubmit={sendOtp} className="register-form">
          <input
            type="email"
            className="form-input"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn form-btn">
            Send OTP
          </button>
        </form>
      </div>
    </section>
  );
}

export default ForgetPassword;
