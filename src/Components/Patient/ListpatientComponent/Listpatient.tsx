import { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Space,
  Avatar,
  Tag,
  Modal,
  message,
} from "antd";

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

interface PatientFormState {
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

const emptyForm: PatientFormState = {
  patientId: 0,
  patientName: "",
  phone: "",
  email: "",
  gender: "",
  bloodGroup: "",
  dob: "",
  emergencyNumber: "",
  disease: "",
  address: "",
  registrationDate: "",
  department: "",
  status: "Active",
  insurance: "",
  companyId: 0,
};

export default function ListPatient() {
  const [data, setData] = useState<PatientTable[]>([]);
  const [loading, setLoading] = useState(false);

  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);

  // ---- Edit-mode tracking ----
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState<PatientFormState>(emptyForm);

  // ---------------- GET PATIENTS ----------------
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/Patient/company/1");

      const formattedData = response.data.map(
        (item: PatientApiResponse) => ({
          key: item.patientId,
          patientId: item.patientId,
          patientName: item.patientName,
          phone: item.phone,
          email: item.email,
          gender: item.gender,
          bloodGroup: item.bloodGroup,
          dob: item.dob,
          emergencyNumber: item.emergencyNumber,
          disease: item.disease,
          address: item.address,
          registrationDate: item.registrationDate,
          department: item.department,
          status: item.status || "Active",
          insurance: item.insurance,
          companyId: item.companyId,
        })
      );

      setData(formattedData);
    } catch (error) {
      console.log(error);
      message.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- OPEN MODAL: ADD ----------------
  const handleAddClick = () => {
    setIsEdit(false);

    const admin = JSON.parse(
      localStorage.getItem("admin") || "{}"
    );

    setFormData({
      ...emptyForm,
      companyId: admin.companyId || 0,
    });

    setPatientModalOpen(true);
  };

  // ---------------- OPEN MODAL: EDIT ----------------
  // Patient list already carries every field the form needs, so we can
  // populate the form straight from the row without a separate fetch call.
  const handleEditClick = (record: PatientTable) => {
    setIsEdit(true);

    setFormData({
      patientId: record.patientId,
      patientName: record.patientName || "",
      phone: record.phone || "",
      email: record.email || "",
      gender: record.gender || "",
      bloodGroup: record.bloodGroup || "",
      dob: record.dob ? record.dob.split("T")[0] : "",
      emergencyNumber: record.emergencyNumber || "",
      disease: record.disease || "",
      address: record.address || "",
      registrationDate: record.registrationDate || "",
      department: record.department || "",
      status: record.status || "Active",
      insurance: record.insurance || "",
      companyId: record.companyId,
    });

    setPatientModalOpen(true);
  };

  // ---------------- SAVE / UPDATE ----------------
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patientName ||
      !formData.phone ||
      !formData.gender ||
      !formData.bloodGroup ||
      !formData.dob ||
      !formData.status
    ) {
      message.error("Please fill required fields");
      return;
    }

    try {
      setPatientLoading(true);

      const admin = JSON.parse(
        localStorage.getItem("admin") || "{}"
      );

      const payload = {
        patientId: isEdit ? formData.patientId : 0,
        patientName: formData.patientName,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        dob: new Date(formData.dob).toISOString(),
        emergencyNumber: formData.emergencyNumber,
        disease: formData.disease,
        address: formData.address,
        registrationDate: isEdit
          ? formData.registrationDate
          : new Date().toISOString(),
        department: formData.department,
        status: formData.status,
        insurance: formData.insurance,
        companyId: isEdit
          ? formData.companyId
          : admin.companyId || 0,
      };

      if (isEdit) {
        await api.put("/Patient", payload);
        message.success("Patient Updated Successfully");
      } else {
        await api.post("/Patient", payload);
        message.success("Patient Created Successfully");
      }

      setPatientModalOpen(false);
      setFormData(emptyForm);
      fetchPatients();
    } catch (error) {
      console.log(error);

      message.error(
        isEdit
          ? "Failed to update patient"
          : "Failed to create patient"
      );
    } finally {
      setPatientLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (patientId: number) => {
    const filtered = data.filter(
      (item) => item.patientId !== patientId
    );

    setData(filtered);
    message.success("Patient removed");
  };

  // ---------------- MENU ----------------
  const getRowMenuItems = (record: PatientTable) => [
    {
      key: "edit",
      label: "Edit",
      onClick: () => handleEditClick(record),
    },
    {
      key: "view",
      label: "View",
      onClick: () => console.log("View", record),
    },
    {
      key: "delete",
      danger: true,
      label: "Delete",
      onClick: () => handleDelete(record.patientId),
    },
  ];

  const userType = localStorage.getItem("userType");

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
          {bloodGroup?.toUpperCase()}
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
          color={
            status.toLowerCase() === "active" ? "green" : "orange"
          }
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
                menu={{ items: getRowMenuItems(record) }}
                trigger={["click"]}
              >
                <Button type="text" icon={<MoreOutlined />} />
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
                label="+ Add Patient"
                onClick={handleAddClick}
              />
            )}
          </Space>
        }
      />

      <Modal
        title={
          <div className="doctor-modal-title">
            <h2>{isEdit ? "Edit Patient" : "Create Patient"}</h2>
            <p>
              {isEdit
                ? "Update patient information and medical details"
                : "Add patient information and medical details"}
            </p>
          </div>
        }
        open={patientModalOpen}
        footer={null}
        width={900}
        centered
        destroyOnClose
        onCancel={() => setPatientModalOpen(false)}
        className="doctor-modal"
      >
        <form onSubmit={handleSave} className="doctor-form">
          <div className="doctor-modal-body">
            <div className="form-grid">
              {/* Patient Name */}
              <div className="form-group">
                <label>
                  Patient Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handlePatientChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>
                  Phone <span>*</span>
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePatientChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handlePatientChange}
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label>
                  Gender <span>*</span>
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div className="form-group">
                <label>
                  Blood Group <span>*</span>
                </label>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label>
                  Date of Birth <span>*</span>
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handlePatientChange}
                  required
                />
              </div>

              {/* Emergency Number */}
              <div className="form-group">
                <label>Emergency Number</label>

                <input
                  type="text"
                  name="emergencyNumber"
                  value={formData.emergencyNumber}
                  onChange={handlePatientChange}
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label>Department</label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handlePatientChange}
                />
              </div>

              {/* Disease */}
              <div className="form-group">
                <label>Disease</label>

                <input
                  type="text"
                  name="disease"
                  value={formData.disease}
                  onChange={handlePatientChange}
                />
              </div>

              {/* Insurance */}
              <div className="form-group">
                <label>Insurance</label>

                <input
                  type="text"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handlePatientChange}
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handlePatientChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Address */}
              <div className="form-group full-width">
                <label>Address</label>

                <textarea
                  rows={4}
                  name="address"
                  value={formData.address}
                  onChange={handlePatientChange}
                />
              </div>
            </div>
          </div>

          <div className="doctor-modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setPatientModalOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={patientLoading}
            >
              {patientLoading
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                ? "Update Patient"
                : "Save Patient"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}