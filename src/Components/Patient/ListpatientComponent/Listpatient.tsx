import { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Space,
  Avatar,
  Tag,
  message,
} from "antd";

import { useNavigate } from "react-router-dom";

import {
  MoreOutlined,
  UserOutlined,
  PhoneOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import api from "../../../api/axios";

import DataTable from "../../../Utils/DataTable";
import AddButton from "../../../Utils/AddButton";

import "./Listpatient.css";

interface PatientApiResponse {
  patientId: number;
  patientName: string;
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  emergencyNumber: string;
  disease: string;
  address: string;
  registrationDate: string;
  department: string;
  status: string;
  insurance: string;
  companyId: number;
}

interface PatientTable {
  key: number;
  patientId: number;
  patientName: string;
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  emergencyNumber: string;
  disease: string;
  address: string;
  registrationDate: string;
  department: string;
  status: string;
  insurance: string;
  companyId: number;
}

export default function ListPatient() {
  const [data, setData] = useState<
    PatientTable[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // ---------------- GET PATIENTS ----------------
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/Patient/company/1"
      );

      const formattedData =
        response.data.map(
          (
            item: PatientApiResponse
          ) => ({
            key: item.patientId,

            patientId:
              item.patientId,

            patientName:
              item.patientName,

            phone: item.phone,

            email: item.email,

            gender: item.gender,

            bloodGroup:
              item.bloodGroup,

            dob: item.dob,

            emergencyNumber:
              item.emergencyNumber,

            disease:
              item.disease,

            address:
              item.address,

            registrationDate:
              item.registrationDate,

            department:
              item.department,

            status:
              item.status ||
              "Active",

            insurance:
              item.insurance,

            companyId:
              item.companyId,
          })
        );

      setData(formattedData);

    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load patients"
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (
    patientId: number
  ) => {
    const filtered = data.filter(
      (item) =>
        item.patientId !== patientId
    );

    setData(filtered);

    message.success(
      "Patient removed"
    );
  };

  // ---------------- MENU ----------------
  const getRowMenuItems = (
    record: PatientTable
  ) => [
    {
      key: "edit",

      label: "Edit",

      onClick: () =>
        navigate(
          "/createpatient",
          {
            state: {
              patient:
                record,
            },
          }
        ),
    },

    {
      key: "view",

      label: "View",

      onClick: () =>
        console.log(
          "View",
          record
        ),
    },

    {
      key: "delete",

      danger: true,

      label: "Delete",

      onClick: () =>
        handleDelete(
          record.patientId
        ),
    },
  ];

    const userType =
  localStorage.getItem("userType");

  // ---------------- COLUMNS ----------------
  const columns: ColumnsType<PatientTable> = [
  {
    title: "Patient",
    dataIndex: "patientName",
    width: 260,
    render: (patientName: string, record) => (
      <div className="patient-user">
        <Avatar
          size={44}
          className="patient-avatar"
          icon={<UserOutlined />}
        />
        <div>
          <h4>{patientName}</h4>
          <p>ID : {record.patientId}</p>
        </div>
      </div>
    ),
  },

  {
    title: "Contact",
    dataIndex: "phone",
    render: (phone: string) => (
      <div className="table-info">
        <PhoneOutlined />
        <span>{phone}</span>
      </div>
    ),
  },

  {
    title: "Gender",
    dataIndex: "gender",
    render: (gender: string) => (
      <Tag className="gender-tag">{gender}</Tag>
    ),
  },

  {
    title: "Blood Group",
    dataIndex: "bloodGroup",
    render: (bloodGroup: string) => (
      <Tag color="red" className="blood-tag">
        {bloodGroup.toUpperCase()}
      </Tag>
    ),
  },

  {
    title: "Department",
    dataIndex: "department",
    render: (department: string) => (
      <span className="department-text">
        {department || "General"}
      </span>
    ),
  },

  {
    title: "Disease",
    dataIndex: "disease",
    render: (disease: string) => (
      <div className="table-info">
        <MedicineBoxOutlined />
        <span>{disease || "General Checkup"}</span>
      </div>
    ),
  },

  {
    title: "Status",
    dataIndex: "status",
    render: (status: string) => (
      <Tag
        color={status.toLowerCase() === "active" ? "green" : "orange"}
        className="status-tag"
      >
        {status}
      </Tag>
    ),
  },

  // Show Action column only for ADMIN
  ...(userType === "ADMIN"
    ? [
        {
          title: "Action",
          key: "action",
          width: 90,
          render: (_: unknown, record: PatientTable) => (
            <Dropdown
              menu={{
                items: getRowMenuItems(record),
              }}
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
              />
            </Dropdown>
          ),
        },
      ]
    : []),
];

  return (
    <div className="patient-list-page">
      <DataTable<PatientTable>
        title="Patient List"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="key"
        loading={loading}
        headerActions={
          <Space>

            {userType === "ADMIN" && (
  <AddButton
    label="Add Patient"
    onClick={() => navigate("/createpatient")}
  />
)}

          </Space>
        }
      />
    </div>
  );
}