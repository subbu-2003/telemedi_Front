import "./Navbar.css";

import {
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Dropdown,
} from "antd";
import { API_BASE_URL } from "../../api/axios";
import { Menu } from "lucide-react";

import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import type { MenuProps } from "antd";



type NavbarProps = {
  toggleSidebar: () => void;
};


const getMenuItems = (
  navigate: ReturnType<typeof useNavigate>
): MenuProps["items"] => [
  {
    key: "1",
    label: "Profile",
    onClick: () => navigate("/profile"),
  },
  {
    key: "2",
    label: "Logout",
    danger: true,
    onClick: () => {
      localStorage.clear();

      navigate("/login", { replace: true });
    },
  },
];

export default function Navbar({
  toggleSidebar,
}: NavbarProps) {
  const [rotated, setRotated] =
    useState(false);

  const userType =
  localStorage.getItem("userType");

const adminData = JSON.parse(
  localStorage.getItem("admin") || "{}"
);

const doctorData = JSON.parse(
  localStorage.getItem("doctor") || "{}"
);

const profileName =
  userType === "ADMIN"
    ? adminData?.name
    : doctorData?.name;

const profileImage =
  userType === "DOCTOR"
    ? doctorData?.profileImage
    : null;

const navigate = useNavigate();

  const handleClick = () => {
    toggleSidebar();

    setRotated((prev) => !prev);
  };

  

  

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="navbar-left">

        <Menu
          size={22}
          className={`menu-btn ${
            rotated ? "rotate" : ""
          }`}
          onClick={handleClick}
        />

        <span className="app-name">
          TELEMEDICINE
        </span>

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        {/* Notification */}
       

        {/* Profile */}
<Dropdown
  menu={{
    items: getMenuItems(navigate),
  }}
>
  <div className="profile-section">

    <Avatar
      size={36}
      src={
        profileImage
          ? `${API_BASE_URL}/${profileImage}`
          : undefined
      }
      icon={<UserOutlined />}
    />

    <span className="profile-name">
      {profileName || "User"}
    </span>

    <DownOutlined />

  </div>
</Dropdown>
      </div>
    </div>
  );
}