import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/register.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const email = state?.email;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await toast.promise(
        axios.post("/user/reset-password", { email, otp, newPassword }),
        {
          loading: "Resetting password...",
          success: "Password reset successful",
          error: "Failed to reset password",
        }
      );
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const resendOtp = async () => {
    try {
      await toast.promise(
        axios.post("/user/send-otp", { email }),
        {
          loading: "Resending OTP...",
          success: "OTP resent successfully",
          error: "Failed to resend OTP",
        }
      );
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Reset Password</h2>
        <form onSubmit={resetPassword} className="register-form">
          <input
            type="text"
            className="form-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {timer > 0 ? (
            <p className="timer-text">Resend OTP in {timer}s</p>
          ) : (
            <button type="button" onClick={resendOtp} className="resend">
              Resend OTP
            </button>
          )}
          <input
            type="password"
            className="form-input"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="form-input"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="btn form-btn">
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
