import React from "react";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <div>
        <div className="legal-page">
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy describes how we collect, use, and protect your
        personal information when you use our Doctor Appointment platform.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Personal Information (name, email, phone number, etc.)</li>
        <li>Device and browser data (IP address, cookies, etc.)</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To schedule and manage appointments</li>
        <li>To send notifications</li>
        <li>To improve the user experience</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We use industry-standard encryption and security measures to protect
        your data. Access is limited to authorized personnel only.
      </p>

      <h2>Your Rights</h2>
      <p>
        You can request to update or delete your information by contacting us at{" "}
        <strong>support@example.com</strong>.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, email us at{" "}
        <strong>support@example.com</strong>.
      </p>
    </div>
    <Footer></Footer>
    </div>
    
  );
};

export default PrivacyPolicy;
