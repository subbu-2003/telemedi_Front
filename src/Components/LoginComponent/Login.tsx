import React, {
  useState,
  
  useEffect,
  useRef,
} from "react";
import {
  Button,
  Input,
  Typography,
  Form,
} from "antd";

import type { InputRef } from "antd";

import api from "../../api/axios";

import "./Login.css";

const { Title, Text } = Typography;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ToastType =
  | "error"
  | "success"
  | "info"
  | "warning";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface LoginFormValues {
  identifier: string;
}

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const isValidEmail = (
  value: string
): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    value.trim()
  );

const isValidPhone = (
  value: string
): boolean =>
  /^\d{10}$/.test(value.trim());

const getIdentifierError = (
  value: string
): string | null => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Please enter your Email ID or Mobile Number.";
  }

  if (/^\d+$/.test(trimmed)) {
    if (!isValidPhone(trimmed)) {
      return "Mobile number must be exactly 10 digits.";
    }

    return null;
  }

  if (!isValidEmail(trimmed)) {
    return "Please enter valid Email ID.";
  }

  return null;
};


// ─────────────────────────────────────────────
// TOAST CONFIG
// ─────────────────────────────────────────────

const TOAST_CONFIG: Record<
  ToastType,
  {
    title: string;
    accent: string;
    iconBg: string;
    icon: React.ReactNode;
  }
> = {
  error: {
    title: "Error",
    accent: "#e53935",
    iconBg: "#fdecea",
    icon: "✕",
  },

  success: {
    title: "Success",
    accent: "#2e7d32",
    iconBg: "#e8f5e9",
    icon: "✓",
  },

  info: {
    title: "Info",
    accent: "#1a73e8",
    iconBg: "#e8f0fe",
    icon: "i",
  },

  warning: {
    title: "Warning",
    accent: "#f59e0b",
    iconBg: "#fff7e6",
    icon: "!",
  },
};

// ─────────────────────────────────────────────
// TOAST COMPONENT
// ─────────────────────────────────────────────

const Toast: React.FC<
  ToastState & {
    onClose: () => void;
  }
> = ({
  visible,
  message,
  type,
  onClose,
}) => {
  const config = TOAST_CONFIG[type];

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 350,
        zIndex: 9999,
        background: "#fff",
        borderRadius: 12,
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.08)",
        overflow: "hidden",
        border:
          "1px solid rgba(0,0,0,0.06)",

        transform: visible
          ? "translateY(0)"
          : "translateY(-20px)",

        opacity: visible ? 1 : 0,

        transition: "0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "start",
          gap: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: config.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.accent,
            fontWeight: 700,
          }}
        >
          {config.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 3,
            }}
          >
            {config.title}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#666",
            }}
          >
            {message}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          height: 3,
          background: config.accent,
        }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// LOGO ICON
// ─────────────────────────────────────────────

const LogoIcon: React.FC = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
  >
    <rect
      x="2"
      y="4"
      width="10"
      height="12"
      rx="2"
      fill="white"
    />

    <rect
      x="14"
      y="4"
      width="10"
      height="5"
      rx="2"
      fill="white"
      fillOpacity="0.7"
    />

    <rect
      x="14"
      y="11"
      width="10"
      height="5"
      rx="2"
      fill="white"
      fillOpacity="0.7"
    />

    <rect
      x="2"
      y="18"
      width="22"
      height="4"
      rx="2"
      fill="white"
      fillOpacity="0.6"
    />
  </svg>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const Login: React.FC = () => {
  const [loading, setLoading] =
    useState(false);
const [loginType, setLoginType] = useState<
  "ADMIN" | "DOCTOR"
>("ADMIN");

  const [step, setStep] = useState<
    | "LOGIN"
    | "FORGOT_PASSWORD"
    | "VERIFY_OTP"
    | "RESET_PASSWORD"
  >("LOGIN");

  const [identifierValue, setIdentifierValue] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [resetEmail, setResetEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    identifierError,
    setIdentifierError,
  ] = useState<string | null>(null);

  const [toast, setToast] =
    useState<ToastState>({
      visible: false,
      message: "",
      type: "error",
    });

  const identifierRef =
    useRef<InputRef>(null);

  const otpRef =
    useRef<InputRef>(null);

  const [form] =
    Form.useForm<LoginFormValues>();

  // ─────────────────────────────────────────────
  // AUTO FOCUS
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (step === "LOGIN") {
      setTimeout(() => {
        identifierRef.current?.focus();
      }, 0);
    }

    if (step === "VERIFY_OTP") {
      setTimeout(() => {
        otpRef.current?.focus();
      }, 0);
    }
  }, [step]);

  const handleLoginTypeChange = (
  type: "ADMIN" | "DOCTOR"
) => {
  setLoginType(type);

  // Reset form values
  setIdentifierValue("");
  setPassword("");
  setIdentifierError("");

  // Doctor should always open Login screen
  setStep("LOGIN");
};

  // ─────────────────────────────────────────────
  // TOAST
  // ─────────────────────────────────────────────

  const showToast = (
    message: string,
    type: ToastType = "error"
  ) => {
    setToast({
      visible: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 4000);
  };

  const closeToast = () => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // ─────────────────────────────────────────────
  // LOGIN API
  // ─────────────────────────────────────────────
const handleLogin = async () => {
  const error =
    getIdentifierError(identifierValue);

  if (error) {
    setIdentifierError(error);
    showToast(error, "error");
    return;
  }

  if (!password) {
    showToast(
      "Please enter password",
      "error"
    );
    return;
  }

  try {
    setLoading(true);

    let response;

    if (loginType === "ADMIN") {
      response = await api.post(
        "/Admin/login",
        {
          email: identifierValue,
          password,
        }
      );

      localStorage.setItem(
        "adminId",
        String(response.data.adminId)
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "userType",
        "ADMIN"
      );
    }else {
  response = await api.post(
    "/Doctor/login",
    {
      email: identifierValue,
      password: password,
    }
  );

  console.log(response.data);

  const doctor =
    response.data.data;

  localStorage.setItem(
    "doctorId",
    doctor.doctorId.toString()
  );

  localStorage.setItem(
    "doctor",
    JSON.stringify(doctor)
  );

  localStorage.setItem(
    "userType",
    "DOCTOR"
  );
}

    showToast(
      `${
        loginType === "ADMIN"
          ? "Admin"
          : "Doctor"
      } Login Successful`,
      "success"
    );

    setTimeout(() => {
      window.location.href =
        "/";
    }, 1000);

  } catch (error: any) {
    console.log(error);

    showToast(
      error?.response?.data?.message ||
        "Invalid Email or Password",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  // ─────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────

  const handleSendOtp =
    async () => {
      if (!resetEmail) {
        showToast(
          "Please enter email",
          "error"
        );

        return;
      }

      try {
        setLoading(true);

        await api.post(
          "/Admin/forgot-password",
          {
            email:
              resetEmail,
          }
        );

        showToast(
          "OTP Sent Successfully",
          "success"
        );

        setStep(
          "VERIFY_OTP"
        );

      } catch (error: any) {
        console.log(error);

        showToast(
          error?.response?.data
            ?.message ||
            "Failed to send OTP",
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

  // ─────────────────────────────────────────────
  // VERIFY OTP
  // ─────────────────────────────────────────────

  const handleVerifyOtp =
    async () => {
      if (!otp) {
        showToast(
          "Please enter OTP",
          "error"
        );

        return;
      }

      try {
        setLoading(true);

        await api.post(
          "/Admin/verify-otp",
          {
            email:
              resetEmail,
            otp: otp,
          }
        );

        showToast(
          "OTP Verified",
          "success"
        );

        setStep(
          "RESET_PASSWORD"
        );

      } catch (error: any) {
        console.log(error);

        showToast(
          error?.response?.data
            ?.message ||
            "Invalid OTP",
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

  // ─────────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────────

  const handleUpdatePassword =
    async () => {
      if (
        !newPassword ||
        !confirmPassword
      ) {
        showToast(
          "Please fill all fields",
          "error"
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        showToast(
          "Passwords do not match",
          "error"
        );

        return;
      }

      try {
        setLoading(true);

        await api.post(
          "/Admin/reset-password",
          {
            email:
              resetEmail,
            newPassword:
              newPassword,
          }
        );

        showToast(
          "Password Updated Successfully",
          "success"
        );

        setTimeout(() => {
          setStep("LOGIN");

          setOtp("");

          setResetEmail("");

          setNewPassword("");

          setConfirmPassword("");
        }, 1000);

      } catch (error: any) {
        console.log(error);

        showToast(
          error?.response?.data
            ?.message ||
            "Failed to update password",
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div className="login-page">
      <Toast
        key={`${toast.type}-${toast.message}`}
        {...toast}
        onClose={closeToast}
      />

      {/* HEADER */}

      <header className="login-header">
        <a
          href="/"
          className="login-logo"
        >
          <div className="login-logo-icon">
            <LogoIcon />
          </div>

          <div className="login-logo-text">
            <span className="login-logo-brand">
              Telemedicine
            </span>

            <span className="login-logo-product">
              HEALTHCARE
            </span>
          </div>
        </a>
      </header>

      {/* MAIN */}

      <main className="login-main">
        {/* LEFT */}

        <section className="login-left">
          <div className="login-illustration-wrapper">
            <img
              src="/Images/Login/login.png"
              alt="Login"
            />
          </div>

          <div className="login-welcome-text">
            <Title
              level={2}
              className="login-welcome-title"
            >
              Welcome!
            </Title>

            <Text className="login-welcome-subtitle">
              Healthcare management
              made simple with
              Telemedicine.
            </Text>
          </div>
        </section>

        {/* RIGHT */}

        <section className="login-right">
          
          <div className="login-card">
            {/* LOGIN TYPE TABS */}

<div className="login-tabs">
  <span
    className={
      loginType === "ADMIN"
        ? "login-tab active"
        : "login-tab"
    }
    onClick={() =>
      handleLoginTypeChange("ADMIN")
    }
  >
    Admin Login
  </span>

  <span
    className={
      loginType === "DOCTOR"
        ? "login-tab active"
        : "login-tab"
    }
    onClick={() =>
      handleLoginTypeChange("DOCTOR")
    }
  >
    Doctor Login
  </span>
</div>
            <Title
  level={3}
  className="login-card-title"
>
  {loginType === "ADMIN"
    ? "Admin Login"
    : "Doctor Login"}
</Title>
            <Text className="login-card-subtitle">
  {loginType === "ADMIN"
    ? "Login to Admin Dashboard"
    : "Login to Doctor Dashboard"}
</Text>

            <Form
              form={form}
              onFinish={
                handleLogin
              }
            >
              {/* LOGIN */}

              {step ===
                "LOGIN" && (
                <>
                  <Form.Item
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <label className="login-form-label">
                      Email ID
                    </label>

                    <Input
                      ref={
                        identifierRef
                      }
                      className="login-input"
                      placeholder="Enter Email"
                      size="large"
                      value={
                        identifierValue
                      }
                      onChange={(
                        e
                      ) =>
                        setIdentifierValue(
                          e.target
                            .value
                        )
                      }
                    />

                    {identifierError && (
                      <div
                        style={{
                          color:
                            "#e53935",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        {
                          identifierError
                        }
                      </div>
                    )}
                  </Form.Item>

                  <Form.Item
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <label className="login-form-label">
                      Password
                    </label>

                    <Input.Password
                      className="login-input"
                      placeholder="Enter Password"
                      size="large"
                      value={
                        password
                      }
                      onChange={(
                        e
                      ) =>
                        setPassword(
                          e.target
                            .value
                        )
                      }
                    />
                  </Form.Item>
{loginType === "ADMIN" && (
  <div
    style={{
      textAlign: "right",
      marginBottom: 18,
    }}
  >
    <span
      className="login-link"
      style={{
        cursor: "pointer",
      }}
      onClick={() =>
        setStep(
          "FORGOT_PASSWORD"
        )
      }
    >
      Forgot Password?
    </span>
  </div>
)}

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-btn-next"
                    loading={
                      loading
                    }
                    block
                  >
                    {loginType === "ADMIN"
  ? "Admin Login"
  : "Doctor Login"}
                  </Button>
                </>
              )}

              {/* FORGOT PASSWORD */}

              {step ===
                "FORGOT_PASSWORD" && (
                <>
                  <Form.Item
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    <label className="login-form-label">
                      Enter Email
                    </label>

                    <Input
                      className="login-input"
                      placeholder="Enter Email"
                      size="large"
                      value={
                        resetEmail
                      }
                      onChange={(
                        e
                      ) =>
                        setResetEmail(
                          e.target
                            .value
                        )
                      }
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    className="login-btn-next"
                    block
                    loading={
                      loading
                    }
                    onClick={
                      handleSendOtp
                    }
                  >
                    Send OTP
                  </Button>
                </>
              )}

              {/* VERIFY OTP */}

              {step ===
                "VERIFY_OTP" && (
                <>
                  <Form.Item
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    <label className="login-form-label">
                      Enter OTP
                    </label>

                    <Input
                      ref={otpRef}
                      className="login-input"
                      placeholder="Enter OTP"
                      size="large"
                      value={otp}
                      onChange={(
                        e
                      ) =>
                        setOtp(
                          e.target
                            .value
                        )
                      }
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    className="login-btn-next"
                    block
                    loading={
                      loading
                    }
                    onClick={
                      handleVerifyOtp
                    }
                  >
                    Verify OTP
                  </Button>
                </>
              )}

              {/* RESET PASSWORD */}

              {step ===
                "RESET_PASSWORD" && (
                <>
                  <Form.Item
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <label className="login-form-label">
                      New Password
                    </label>

                    <Input.Password
                      className="login-input"
                      placeholder="Enter New Password"
                      size="large"
                      value={
                        newPassword
                      }
                      onChange={(
                        e
                      ) =>
                        setNewPassword(
                          e.target
                            .value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    <label className="login-form-label">
                      Confirm Password
                    </label>

                    <Input.Password
                      className="login-input"
                      placeholder="Confirm Password"
                      size="large"
                      value={
                        confirmPassword
                      }
                      onChange={(
                        e
                      ) =>
                        setConfirmPassword(
                          e.target
                            .value
                        )
                      }
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    className="login-btn-next"
                    block
                    loading={
                      loading
                    }
                    onClick={
                      handleUpdatePassword
                    }
                  >
                    Update Password
                  </Button>
                </>
              )}
            </Form>

            {/* FOOTER */}

            <div className="login-card-footer">
              <a
                href="/terms"
                className="login-link"
              >
                Terms &
                Condition
              </a>

              <span className="login-link-sep">
                |
              </span>

              <a
                href="/terms"
                className="login-link"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="login-help">
            Need Help?{" "}
            <a
              href="/contact"
              className="login-help-link"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;