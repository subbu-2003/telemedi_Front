import { Avatar, Card, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

import  {
  API_BASE_URL,
} from "../../api/axios";

import "./Profile.css";

export default function Profile() {
  const userType =
    localStorage.getItem("userType");

  const admin = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  const doctor = JSON.parse(
    localStorage.getItem("doctor") || "{}"
  );

  const user =
    userType === "ADMIN"
      ? admin
      : doctor;

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar
            size={120}
            src={
              userType === "DOCTOR" &&
              user?.profileImage
                ? `${API_BASE_URL}/${user.profileImage}`
                : undefined
            }
            icon={<UserOutlined />}
          />

          <h2>
            {user?.name}
          </h2>

          <Tag color="blue">
            {userType}
          </Tag>
        </div>

        <div className="profile-body">

          <div className="profile-row">
            <span>Email</span>
            <strong>
              {user?.email}
            </strong>
          </div>

          {userType === "DOCTOR" && (
            <>
              <div className="profile-row">
                <span>Phone</span>
                <strong>
                  {user?.phone}
                </strong>
              </div>

              <div className="profile-row">
                <span>Gender</span>
                <strong>
                  {user?.gender}
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Department
                </span>
                <strong>
                  {user?.department}
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Experience
                </span>
                <strong>
                  {user?.experience} Years
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Hospital
                </span>
                <strong>
                  {user?.hospital}
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Ratings
                </span>
                <strong>
                  ⭐ {user?.ratings}
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Success Rate
                </span>
                <strong>
                  {user?.successRate}%
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Address
                </span>
                <strong>
                  {user?.address}
                </strong>
              </div>

              <div className="profile-row">
                <span>Status</span>
                <Tag
                  color={
                    user?.status ===
                    "Active"
                      ? "green"
                      : "red"
                  }
                >
                  {user?.status}
                </Tag>
              </div>
            </>
          )}

          {userType === "ADMIN" && (
            <>
              <div className="profile-row">
                <span>
                  Admin ID
                </span>
                <strong>
                  {user?.adminId}
                </strong>
              </div>

              <div className="profile-row">
                <span>
                  Company ID
                </span>
                <strong>
                  {user?.companyId}
                </strong>
              </div>

              <div className="profile-row">
                <span>Status</span>
                <Tag
                  color={
                    user?.status ===
                    "Active"
                      ? "green"
                      : "red"
                  }
                >
                  {user?.status}
                </Tag>
              </div>

              <div className="profile-row">
                <span>
                  Created Date
                </span>
                <strong>
                  {new Date(
                    user?.createdDate
                  ).toLocaleDateString()}
                </strong>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}