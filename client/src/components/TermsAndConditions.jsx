import React from "react";
import Footer from "./Footer";

const TermsAndConditions = () => {
  return (
    <div>
        <div className="legal-page">
      <h1>Terms and Conditions</h1>

      <p>
        These terms and conditions govern your use of the Doctor Appointment
        platform. By accessing or using our services, you agree to comply with
        these terms.
      </p>

      <h2>User Responsibilities</h2>
      <ul>
        <li>Provide accurate personal and medical information</li>
        <li>Use the platform respectfully and legally</li>
        <li>Do not misuse or disrupt services</li>
      </ul>

      <h2>Appointments</h2>
      <p>
        Users can book, reschedule, or cancel appointments. No-shows may affect
        future booking privileges.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on the platform is the property of the company unless
        otherwise specified.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        We are not responsible for any medical outcomes, missed appointments, or
        user negligence. This platform is a tool, not a medical provider.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We may update these terms. Continued use of the platform means you
        accept the updated terms.
      </p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default TermsAndConditions;
