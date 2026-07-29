import { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Space,
  Avatar,
  Select,
  Tag,
  message,
} from "antd";
import  { API_BASE_URL } from "../../../api/axios";

import {
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import type { ColumnsType } from "antd/es/table";

import api from "../../../api/axios";

import DataTable from "../../../Utils/DataTable";
import AddButton from "../../../Utils/AddButton";

import "./Doctorlist.css";

interface DoctorApiResponse {
  doctorId: number;
  name: string;
  gender: string;
  email: string;
  phone: string;
  department: string;
  joiningDate: string;
  experience: number;
  address: string;
  ratings: number;
  successRate: number;
  hospital: string;
  profileImage: string;
  status: string;
  companyId: number;
}

interface DoctorTable {
  key: number;
  doctorId: number;
  name: string;
  gender: string;
  department: string;
  phone: string;
  experience: number;
  ratings: number;
  status: string;
  profileImage: string;
}

export default function Doctorlist() {
  const [data, setData] = useState<
    DoctorTable[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // ---------------- GET API ----------------
  useEffect(() => {
    fetchDoctors();
  }, []);

  const updateDoctorStatus = async (
  doctorId: number,
  status: string
) => {
  try {
    await api.put(
      "/Doctor/update-status",
      {
        doctorId,
        status,
      }
    );

    setData((prev) =>
      prev.map((item) =>
        item.doctorId === doctorId
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    message.success(
      "Status updated successfully"
    );
  } catch (error) {
    console.log(error);

    message.error(
      "Failed to update status"
    );
  }
};

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/Doctor/company/1"
      );

      const formattedData = response.data.map(
  (item: DoctorApiResponse) => ({
    key: item.doctorId,

    doctorId: item.doctorId,

    name: item.name,

    gender: item.gender,

    department: item.department,

    phone: item.phone,

    experience: item.experience,

    ratings: item.ratings,

    status: item.status,

    profileImage:
      item.profileImage || "",
  })
);

      setData(formattedData);

    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load doctors"
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (
    doctorId: number
  ) => {
    const filtered = data.filter(
      (item) =>
        item.doctorId !== doctorId
    );

    setData(filtered);

    message.success(
      "Doctor removed"
    );
  };

  // ---------------- ACTION MENU ----------------
  const getRowMenuItems = (
    record: DoctorTable
  ) => [
    {
      key: "edit",
      label: "Edit",

      onClick: () =>
        navigate(
          `/createdoctor?id=${record.doctorId}`
        ),
    },

    {
      key: "delete",
      label: "Delete",
      danger: true,

      onClick: () =>
        handleDelete(
          record.doctorId
        ),
    },
  ];

  // ---------------- TABLE COLUMNS ----------------
  const columns: ColumnsType<DoctorTable> =
    [
      {
        title: "Doctor ID",

        dataIndex: "doctorId",

        width: 120,

        render: (
          doctorId: number
        ) => (
          <span className="doctor-id">
            #{doctorId}
          </span>
        ),
      },

      {
  title: "Doctor",

  dataIndex: "name",

  render: (
    name: string,
    record
  ) => (
    <div className="doctor-info">

      <Avatar
        size={50}
        src={
          record.profileImage
            ? `${API_BASE_URL}/${record.profileImage}`
            : undefined
        }
        icon={<UserOutlined />}
      />

      <div>

        <h4>{name}</h4>

        <p>
          Medical Specialist
        </p>

      </div>

    </div>
  ),
},

      {
        title: "Gender",

        dataIndex: "gender",

        render: (
          gender: string
        ) => (
          <span className="table-text">
            {gender}
          </span>
        ),
      },

      {
        title: "Department",

        dataIndex: "department",

        render: (
          department: string
        ) => (
          <Tag color="blue">
            {department}
          </Tag>
        ),
      },

      {
        title: "Phone",

        dataIndex: "phone",

        render: (
          phone: string
        ) => (
          <span className="table-text">
            {phone}
          </span>
        ),
      },

      {
        title: "Experience",

        dataIndex: "experience",

        render: (
          experience: number
        ) => (
          <span className="table-text">
            {experience} Years
          </span>
        ),
      },

      {
        title: "Ratings",

        dataIndex: "ratings",

        render: (
          ratings: number
        ) => (
          <Tag color="gold">
            ⭐ {ratings}
          </Tag>
        ),
      },

      {
  title: "Status",

  dataIndex: "status",

  render: (
    status: string,
    record: DoctorTable
  ) => (
    <Select
      value={status}
      style={{
        width: 120,
      }}
      onChange={(value) =>
        updateDoctorStatus(
          record.doctorId,
          value
        )
      }
      options={[
        {
          label: "Active",
          value: "Active",
        },
        {
          label: "Inactive",
          value: "Inactive",
        },
      ]}
    />
  ),
},

      {
        title: "Action",

        key: "action",

        width: 80,

        render: (
          _: unknown,
          record: DoctorTable
        ) => (
          <Dropdown
            menu={{
              items:
                getRowMenuItems(
                  record
                ),
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={
                <MoreOutlined />
              }
            />
          </Dropdown>
        ),
      },
    ];

  // ---------------- UI ----------------
  return (
    <div className="doctor-list-page">

      <DataTable<DoctorTable>
        title="Doctor List"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="key"
        loading={loading}
        headerActions={
          <Space>

            <AddButton
              label="Add Doctor"
              onClick={() =>
                navigate(
                  "/createdoctor"
                )
              }
            />

          </Space>
        }
      />

    </div>
  );
}