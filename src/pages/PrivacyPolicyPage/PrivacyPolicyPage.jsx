import React from "react";
import {Link} from "react-router-dom";
import "./PrivacyPolicyPage.css";

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> August 1, 2025</p>

      <p>
        Dulles Geotechnical and Material Testing Services Inc. (DGMTS) respects your
        privacy and is committed to protecting the personal information you share
        with us. This privacy notice applies solely to information collected by this website.
      </p>

      <p>
        By using our website, you agree to the terms of this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information in the following ways:</p>
      <ul>
        <li>
          <strong>a. Information You Provide</strong>
          <ul>
            <li>Contact Information: Name, email address and phone number when you fill out a contact form.</li>
            <li>Business Inquiries: Information provided when you inquire about our services, request estimates, or engage in contracts.</li>
            <li>Careers: Resume and employment-related information if you apply for a job.</li>
          </ul>
        </li>
        <li>
          <strong>b. Information Collected Automatically</strong>
          <ul>
            <li>Usage Data: IP address, browser type, operating system, referring URLs, pages visited, and date/time stamps.</li>
            <li>Cookies and Tracking Technologies: We may use cookies and similar technologies to enhance your experience, analyze usage, and improve our services.</li>
          </ul>
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide and manage our geotechnical, material testing, and consulting services.</li>
        <li>Respond to inquiries and provide customer support.</li>
        <li>Process payments.</li>
        <li>Improve our website, services, and user experience.</li>
        <li>Send important updates, newsletters, and marketing materials (with your consent).</li>
        <li>Comply with legal obligations and enforce our terms and policies.</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>We do not sell or rent your personal information. We may share your information only in the following situations:</p>
      <ul>
        <li><strong>Third-Party Service Providers:</strong> With vendors that support our business operations, such as IT providers, cloud services, marketing platforms, and payment processors (see Section 6).</li>
        <li><strong>Legal Compliance:</strong> When required to comply with applicable laws, legal proceedings, or government requests.</li>
        <li><strong>Business Transfers:</strong> In the event of a merger, sale, or acquisition, your information may be transferred to the new entity.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical security measures to protect your personal information. 
        However, no method of transmission over the Internet or electronic storage is 100% secure. You share data with us at your own risk.
      </p>

      <h2>5. Your Rights and Choices</h2>
      <ul>
        <li>Request access to or correction of your personal information.</li>
        <li>Opt out of receiving marketing communications at any time by clicking the "unsubscribe" link or contacting us directly.</li>
        <li>Request deletion of your personal data, subject to applicable laws.</li>
      </ul>

      <h2>6. Payments and Third-Party Processing</h2>
      <p>
        When you make a payment through our website, the transaction is processed by a third-party payment processor. 
        While we collect the relevant service and billing information necessary to initiate payment, your payment card details are not stored on our servers.
      </p>
      <ul>
        <li>The payment processor may collect and store your payment information in accordance with their own Privacy Policy and Terms of Use.</li>
        <li>A processing fee, imposed by the third party, may be added to your payment total. This fee is not collected or controlled by DGMTS.</li>
        <li>DGMTS is not responsible for data breaches or misuse occurring on the payment processor's platform, though we only use providers with robust security practices.</li>
        <li>By making a payment through our website, you consent to the collection, use, and processing of your information by the third-party payment provider as necessary to complete the transaction.</li>
      </ul>

      <h2>7. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of such sites. 
        Please review their privacy policies before submitting personal data.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. 
        If we learn we have collected such information, we will promptly delete it.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the "Effective Date" at the top. 
        Your continued use of our website after changes are posted constitutes your acceptance of those changes.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our data practices, please contact us.
      </p>
      
      {/* Contact Button */}
      <Link to="/contact" className="btn btn-primary">Contact Us</Link>
    </div>
  );
};

export default PrivacyPolicyPage;
