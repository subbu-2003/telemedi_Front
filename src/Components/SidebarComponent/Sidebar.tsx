import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChevronRight,
  ChevronDown,
  Phone,
  Receipt,
  MessageCircle,
  Stethoscope,
  Video,
  UserRoundCog,
} from "lucide-react";
import React from "react";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  pinned: boolean;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
};

type ItemProps = {
  to?: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  collapsed: boolean;
  children?: { label: string; to: string }[];
};

function SidebarItem({
  to,
  icon,
  label,
  badge,
  collapsed,
  children,
}: ItemProps) {
  const location = useLocation();

  const isChildActive =
    children?.some((child) =>
      location.pathname.includes(child.to)
    ) || false;

  const [open, setOpen] = React.useState(isChildActive);

  if (children) {
    return (
      <div>
        <div
          className={`sidebar-item ${isChildActive ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <div className="item-left">
            {icon}
            {!collapsed && <span>{label}</span>}
          </div>

          {!collapsed && (
            <ChevronDown
              size={16}
              className={`arrow ${open ? "rotate" : ""}`}
            />
          )}
        </div>

        {!collapsed && open && (
          <div className="dropdown">
            {children.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `dropdown-item ${
                    isActive ? "dropdown-active" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to || "#"}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      <div className="item-left">
        {icon}
        {!collapsed && <span>{label}</span>}
      </div>

      {!collapsed && (
        <div className="item-right">
          {badge && <span className="badge">{badge}</span>}
          <ChevronRight size={16} />
        </div>
      )}
    </NavLink>
  );
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  pinned,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const location = useLocation();

  const isMobile = window.innerWidth <= 768;

  /* Auto close on route change (mobile) */
  React.useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (!pinned && !isMobile) {
      setCollapsed(false);
    }
  };

  const userType =
  localStorage.getItem("userType");

  const handleMouseLeave = () => {
    if (!pinned && !isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Overlay */}
      {mobileOpen && isMobile && (
        <div
          className="overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`Sidebar 
          ${collapsed && !isMobile ? "collapsed" : ""} 
          ${mobileOpen ? "mobile-open" : ""}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-menu">

          {/* Dashboard */}
          <SidebarItem
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={isMobile ? false : collapsed}
          />

      {(userType === "ADMIN" || userType === "DOCTOR") && (
  <SidebarItem
    icon={<UserRoundCog size={18} />}
    label="Appointment"
    collapsed={isMobile ? false : collapsed}
    children={
      userType === "ADMIN"
        ? [
            {
              label: "Create Appointment",
              to: "/createappointment",
            },
            {
              label: "List Appointment",
              to: "/listappointment",
            },
          ]
        : [
            {
              label: "List Appointment",
              to: "/listappointment",
            },
          ]
    }
  />
)}

       {userType === "ADMIN" && (
  <SidebarItem
    icon={<UserRoundCog size={18} />}
    label="Doctor"
    collapsed={isMobile ? false : collapsed}
    children={[
      {
        label: "Create Doctor",
        to: "/createdoctor",
      },
      {
        label: "List Doctor",
        to: "/doctorlist",
      },
    ]}
  />
)}

          {/* Patient */}
{(userType === "ADMIN" || userType === "DOCTOR") && (
  <SidebarItem
    icon={<Users size={18} />}
    label="Patient"
    collapsed={isMobile ? false : collapsed}
    children={
      userType === "ADMIN"
        ? [
            {
              label: "Create Patient",
              to: "/createpatient",
            },
            {
              label: "List Patient",
              to: "/patientlist",
            },
          ]
        : [
            {
              label: "List Patient",
              to: "/patientlist",
            },
          ]
    }
  />
)}

          {/* E-Prescription */}
          <SidebarItem
            icon={<Stethoscope size={18} />}
            label="E-Prescription"
            collapsed={isMobile ? false : collapsed}
            children={[
              {
                label: "Create E-Prescription",
                to: "/createprescription",
              },
              {
                label: "List E-Prescription",
                to: "/listprescription",
              },
            ]}
          />

          {userType === "ADMIN" && (
  <SidebarItem
    to="/payment"
    icon={<Receipt size={18} />}
    label="Payment History"
    collapsed={isMobile ? false : collapsed}
  />
)}

         {userType === "ADMIN" && (
  <SidebarItem
    to="/meeting"
    icon={<Video size={18} />}
    label="Meeting"
    collapsed={isMobile ? false : collapsed}
  />
)}

         
        </div>

        {/* Footer */}
{(!collapsed || isMobile) && (
  <div className="sidebar-footer">

    <div className="support-card">

      <div className="support-item">
        <div className="support-icon call-icon">
          <Phone size={15} />
        </div>

        <div className="support-content">
          <span>Support Number</span>
          <p>9344723010</p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="support-item">
        <div className="support-icon whatsapp-bg">
          <MessageCircle size={15} />
        </div>

        <div className="support-content">
          <span>Whatsapp Support</span>
          <p>Chat With Us</p>
        </div>
      </div>

    </div>

  </div>
)}
      </div>
    </>
  );
}