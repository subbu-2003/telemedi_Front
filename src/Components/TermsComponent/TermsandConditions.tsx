import { useState } from "react";

import {
  FileProtectOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { Tabs, Typography, Divider } from "antd";
import type { TabsProps } from "antd";

import "./TermsandConditions.css";

const { Title, Paragraph, Text } = Typography;

export default function TermsandConditions() {
  const [activeKey, setActiveKey] = useState("1");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="tc-tab-label">
          <FileProtectOutlined />
          Terms &amp; Conditions
        </span>
      ),
      children: (
        <div className="tc-content">
          <Title level={3}>Terms &amp; Conditions</Title>
          <Paragraph type="secondary">Last updated: July 30, 2026</Paragraph>

          <Paragraph>
            Welcome to our website. By accessing or using this website, you agree to be bound by the
            following terms and conditions. Please read them carefully before using our services.
          </Paragraph>

          <Title level={4}>1. Acceptance of Terms</Title>
          <Paragraph>
            By accessing this website, you confirm that you accept these terms and conditions and agree
            to comply with them. If you do not agree, you must not use this website.
          </Paragraph>

          <Title level={4}>2. Use of Website</Title>
          <Paragraph>
            You agree to use this website only for lawful purposes and in a manner that does not
            infringe the rights of, restrict, or inhibit anyone else's use of the site. Prohibited
            behavior includes harassment, transmission of obscene or offensive content, and disruption
            of normal flow of dialogue.
          </Paragraph>

          <Title level={4}>3. Intellectual Property</Title>
          <Paragraph>
            All content on this website, including text, graphics, logos, images, and software, is the
            property of the company or its content suppliers and is protected by applicable copyright
            and trademark laws.
          </Paragraph>

          <Title level={4}>4. Account Responsibilities</Title>
          <Paragraph>
            If you create an account with us, you are responsible for maintaining the confidentiality of
            your account information and for all activities that occur under your account.
          </Paragraph>

          <Title level={4}>5. Limitation of Liability</Title>
          <Paragraph>
            We shall not be liable for any indirect, incidental, special, or consequential damages
            arising out of or in connection with your use of this website.
          </Paragraph>

          <Title level={4}>6. Changes to Terms</Title>
          <Paragraph>
            We reserve the right to update or modify these terms at any time without prior notice. Your
            continued use of the website after changes constitutes acceptance of the new terms.
          </Paragraph>

          <Title level={4}>7. Governing Law</Title>
          <Paragraph>
            These terms shall be governed by and construed in accordance with the laws applicable in our
            jurisdiction, without regard to conflict of law principles.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="tc-tab-label">
          <SafetyCertificateOutlined />
          Privacy Policy
        </span>
      ),
      children: (
        <div className="tc-content">
          <Title level={3}>Privacy Policy</Title>
          <Paragraph type="secondary">Last updated: July 30, 2026</Paragraph>

          <Paragraph>
            Your privacy is important to us. This policy explains what information we collect, how we
            use it, and the choices you have regarding your data.
          </Paragraph>

          <Title level={4}>1. Information We Collect</Title>
          <Paragraph>
            We may collect personal information such as your name, email address, phone number, billing
            and shipping address, and payment details when you register, place an order, or contact
            customer support. We also collect non-personal data such as browser type, IP address, and
            browsing behavior through cookies.
          </Paragraph>

          <Title level={4}>2. How We Use Your Information</Title>
          <Paragraph>
            We use collected information to process orders, provide customer support, personalize your
            experience, send updates or promotional communications (with your consent), and improve our
            website and services.
          </Paragraph>

          <Title level={4}>3. Cookies</Title>
          <Paragraph>
            We use cookies to enhance your browsing experience, analyze site traffic, and understand
            where our visitors come from. You can choose to disable cookies through your browser
            settings, though this may affect website functionality.
          </Paragraph>

          <Title level={4}>4. Data Sharing</Title>
          <Paragraph>
            We do not sell or rent your personal information to third parties. We may share data with
            trusted partners who assist us in operating our website, conducting business, or servicing
            you, as long as they agree to keep this information confidential.
          </Paragraph>

          <Title level={4}>5. Data Security</Title>
          <Paragraph>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </Paragraph>

          <Title level={4}>6. Your Rights</Title>
          <Paragraph>
            You have the right to access, correct, or delete your personal data at any time. To exercise
            these rights, please contact our support team.
          </Paragraph>

          <Title level={4}>7. Policy Updates</Title>
          <Paragraph>
            We may update this Privacy Policy periodically. Any changes will be posted on this page with
            a revised "last updated" date.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span className="tc-tab-label">
          <CarOutlined />
          Shipping Policy
        </span>
      ),
      children: (
        <div className="tc-content">
          <Title level={3}>Shipping Policy</Title>
          <Paragraph type="secondary">Last updated: July 30, 2026</Paragraph>

          <Paragraph>
            We strive to deliver your orders quickly and safely. Please review our shipping guidelines
            below.
          </Paragraph>

          <Title level={4}>1. Order Processing</Title>
          <Paragraph>
            Orders are typically processed within 1–2 business days of payment confirmation. Orders
            placed on weekends or public holidays will be processed on the next business day.
          </Paragraph>

          <Title level={4}>2. Shipping Timeframes</Title>
          <Paragraph>
            Standard delivery usually takes 3–7 business days depending on your location. Express
            shipping options may be available at checkout for faster delivery. Delivery times are
            estimates and are not guaranteed.
          </Paragraph>

          <Title level={4}>3. Shipping Charges</Title>
          <Paragraph>
            Shipping charges are calculated at checkout based on the delivery address, package weight,
            and selected shipping method. Free shipping may be offered on orders above a specified
            amount, if applicable.
          </Paragraph>

          <Title level={4}>4. Order Tracking</Title>
          <Paragraph>
            Once your order is shipped, you will receive a confirmation email with a tracking number so
            you can monitor your shipment's progress.
          </Paragraph>

          <Title level={4}>5. Delayed or Lost Shipments</Title>
          <Paragraph>
            While we work with trusted courier partners, delays due to weather, customs, or courier
            issues may occasionally occur. If your order is significantly delayed or lost in transit,
            please contact our support team for assistance.
          </Paragraph>

          <Title level={4}>6. International Shipping</Title>
          <Paragraph>
            For international orders, customers are responsible for any customs duties, taxes, or import
            fees levied by their country. These charges are not included in the order total.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span className="tc-tab-label">
          <CreditCardOutlined />
          Payment Policy
        </span>
      ),
      children: (
        <div className="tc-content">
          <Title level={3}>Payment Policy</Title>
          <Paragraph type="secondary">Last updated: July 30, 2026</Paragraph>

          <Paragraph>
            We aim to make your payment experience simple, secure, and transparent. Please review our
            accepted payment methods and terms below.
          </Paragraph>

          <Title level={4}>1. Accepted Payment Methods</Title>
          <Paragraph>
            We accept payments via major credit and debit cards, net banking, UPI, and other verified
            digital wallets or payment gateways as displayed at checkout.
          </Paragraph>

          <Title level={4}>2. Payment Security</Title>
          <Paragraph>
            All transactions are processed through secure, encrypted payment gateways. We do not store
            your complete card details on our servers.
          </Paragraph>

          <Title level={4}>3. Order Confirmation</Title>
          <Paragraph>
            An order is confirmed only after successful payment authorization. You will receive an order
            confirmation email once payment has been verified.
          </Paragraph>

          <Title level={4}>4. Failed or Declined Payments</Title>
          <Paragraph>
            If a payment fails or is declined, the order will not be processed. Please verify your
            payment details or contact your bank before retrying the transaction.
          </Paragraph>

          <Title level={4}>5. Refunds</Title>
          <Paragraph>
            Approved refunds will be credited to the original payment method used during purchase.
            Refund processing times may vary depending on your bank or payment provider, typically
            taking 5–10 business days.
          </Paragraph>

          <Title level={4}>6. Currency</Title>
          <Paragraph>
            All prices are listed and charged in the currency displayed at checkout unless otherwise
            specified.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <span className="tc-tab-label">
          <ExclamationCircleOutlined />
          Disclaimer
        </span>
      ),
      children: (
        <div className="tc-content">
          <Title level={3}>Disclaimer</Title>
          <Paragraph type="secondary">Last updated: July 30, 2026</Paragraph>

          <Paragraph>
            The information provided on this website is for general informational purposes only. While
            we strive to keep information accurate and up to date, we make no representations or
            warranties of any kind about the completeness, accuracy, or reliability of this content.
          </Paragraph>

          <Title level={4}>1. No Professional Advice</Title>
          <Paragraph>
            Content on this website does not constitute professional, legal, financial, or medical
            advice. You should seek independent professional guidance before making decisions based on
            information found here.
          </Paragraph>

          <Title level={4}>2. External Links</Title>
          <Paragraph>
            Our website may contain links to third-party websites. We have no control over the content
            or practices of these sites and accept no responsibility for any loss or damage arising from
            their use.
          </Paragraph>

          <Title level={4}>3. Limitation of Liability</Title>
          <Paragraph>
            In no event shall we be liable for any loss or damage, including without limitation,
            indirect or consequential loss, arising from the use of this website or reliance on its
            content.
          </Paragraph>

          <Title level={4}>4. Product Information</Title>
          <Paragraph>
            We make reasonable efforts to display product details, images, and pricing accurately;
            however, minor variations may occur. We reserve the right to correct any errors at any time.
          </Paragraph>

          <Title level={4}>5. Changes to Disclaimer</Title>
          <Paragraph>
            This disclaimer may be updated periodically without prior notice. Continued use of the
            website signifies acceptance of the updated disclaimer.
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <div className="tc-wrapper">
      <div className="tc-header">
        <Title level={2} className="tc-heading">
          Policies &amp; Legal Information
        </Title>
        <Text type="secondary">
          Please review our policies carefully. They govern your use of our website and services.
        </Text>
      </div>

      <Divider className="tc-divider" />

      <div className="tc-card">
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          size="large"
          tabPosition="top"
          className="tc-tabs"
        />
      </div>
    </div>
  );
}