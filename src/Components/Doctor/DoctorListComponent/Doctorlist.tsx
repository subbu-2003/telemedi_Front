import { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Space,
  Avatar,
  Select,
  Tag,
  Modal,
  message,
} from "antd";
import { API_BASE_URL } from "../../../api/axios";

import { MoreOutlined, UserOutlined } from "@ant-design/icons";

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

interface DoctorFormState {
  name: string;
  gender: string;
  email: string;
  passwordHash: string;
  phone: string;
  department: string;
  joiningDate: string;
  experience: number;
  hospital: string;
  ratings: number;
  successRate: number;
  address: string;
  status: string;
}

const emptyForm: DoctorFormState = {
  name: "",
  gender: "",
  email: "",
  passwordHash: "",
  phone: "",
  department: "",
  joiningDate: "",
  experience: 0,
  hospital: "",
  ratings: 0,
  successRate: 0,
  address: "",
  status: "Active",
};

export default function Doctorlist() {
  const [data, setData] = useState<DoctorTable[]>([]);
  const [loading, setLoading] = useState(false);

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [fetchingDoctor, setFetchingDoctor] = useState(false);

  // ---- Edit-mode tracking ----
  const [isEdit, setIsEdit] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(
    null
  );

  const [profileImage, setProfileImage] = useState<File | null>(null);
  // Existing image URL when editing (separate from a freshly picked File)
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  const [formData, setFormData] = useState<DoctorFormState>(emptyForm);

  // ---------------- GET LIST ----------------
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await api.get("/Doctor/company/1");

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
          profileImage: item.profileImage || "",
        })
      );

      setData(formattedData);
    } catch (error) {
      console.log(error);
      message.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorStatus = async (
    doctorId: number,
    status: string
  ) => {
    try {
      await api.put("/Doctor/update-status", {
        doctorId,
        status,
      });

      setData((prev) =>
        prev.map((item) =>
          item.doctorId === doctorId
            ? { ...item, status }
            : item
        )
      );

      message.success("Status updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Failed to update status");
    }
  };

  // ---------------- FETCH SINGLE DOCTOR (for edit) ----------------
  const fetchDoctorById = async (doctorId: number) => {
    try {
      setFetchingDoctor(true);

      const response = await api.get(`/Doctor/${doctorId}`);
      const doctor: DoctorApiResponse = response.data;

      setFormData({
        name: doctor.name || "",
        gender: doctor.gender || "",
        email: doctor.email || "",
        passwordHash: "", // never prefill password hash
        phone: doctor.phone || "",
        department: doctor.department || "",
        joiningDate: doctor.joiningDate
          ? doctor.joiningDate.split("T")[0]
          : "",
        experience: doctor.experience || 0,
        hospital: doctor.hospital || "",
        ratings: doctor.ratings || 0,
        successRate: doctor.successRate || 0,
        address: doctor.address || "",
        status: doctor.status || "Active",
      });

      setExistingImageUrl(
        doctor.profileImage
          ? `${API_BASE_URL}/${doctor.profileImage}`
          : ""
      );
    } catch (error) {
      console.log(error);
      message.error("Failed to load doctor details");
      setDoctorModalOpen(false);
    } finally {
      setFetchingDoctor(false);
    }
  };

  // ---------------- OPEN MODAL: ADD ----------------
  const handleAddClick = () => {
    setIsEdit(false);
    setEditingDoctorId(null);
    setFormData(emptyForm);
    setProfileImage(null);
    setExistingImageUrl("");
    setDoctorModalOpen(true);
  };

  // ---------------- OPEN MODAL: EDIT ----------------
  const handleEditClick = (record: DoctorTable) => {
    setIsEdit(true);
    setEditingDoctorId(record.doctorId);
    setProfileImage(null);
    setExistingImageUrl("");
    setDoctorModalOpen(true);
    fetchDoctorById(record.doctorId);
  };

  const handleDoctorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "experience" ||
        name === "ratings" ||
        name === "successRate"
          ? Number(value)
          : value,
    }));
  };

  // ---------------- SAVE (CREATE / UPDATE) ----------------
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setDoctorLoading(true);

      const payload = new FormData();

      payload.append(
        "doctorId",
        isEdit ? editingDoctorId!.toString() : "0"
      );

      payload.append("name", formData.name);
      payload.append("gender", formData.gender);
      payload.append("email", formData.email);
      payload.append("passwordHash", formData.passwordHash);
      payload.append("phone", formData.phone);
      payload.append("department", formData.department);
      payload.append("joiningDate", formData.joiningDate);
      payload.append(
        "experience",
        formData.experience.toString()
      );
      payload.append("address", formData.address);
      payload.append("ratings", formData.ratings.toString());
      payload.append(
        "successRate",
        formData.successRate.toString()
      );
      payload.append("hospital", formData.hospital);
      payload.append("status", formData.status);
      payload.append("companyId", "1");

      if (profileImage) {
        payload.append("profileImage", profileImage);
      }

      if (!isEdit) {
        await api.post("/Doctor", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        message.success("Doctor Created Successfully");
      } else {
        await api.put("/Doctor", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        message.success("Doctor Updated Successfully");
      }

      setDoctorModalOpen(false);
      fetchDoctors();
    } catch (error: any) {
      console.log(error);

      message.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setDoctorLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (doctorId: number) => {
    const filtered = data.filter(
      (item) => item.doctorId !== doctorId
    );

    setData(filtered);
    message.success("Doctor removed");
  };

  // ---------------- ACTION MENU ----------------
  const getRowMenuItems = (record: DoctorTable) => [
    {
      key: "edit",
      label: "Edit",
      onClick: () => handleEditClick(record),
    },
    {
      key: "delete",
      label: "Delete",
      danger: true,
      onClick: () => handleDelete(record.doctorId),
    },
  ];

  // ---------------- TABLE COLUMNS ----------------
  const columns: ColumnsType<DoctorTable> = [
    {
      title: "Doctor ID",
      dataIndex: "doctorId",
      width: 120,
      render: (doctorId: number) => (
        <span className="doctor-id">#{doctorId}</span>
      ),
    },

    {
      title: "Doctor",
      dataIndex: "name",
      render: (name: string, record) => (
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
            <p>Medical Specialist</p>
          </div>
        </div>
      ),
    },

    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender: string) => (
        <span className="table-text">{gender}</span>
      ),
    },

    {
      title: "Department",
      dataIndex: "department",
      render: (department: string) => (
        <Tag color="blue">{department}</Tag>
      ),
    },

    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone: string) => (
        <span className="table-text">{phone}</span>
      ),
    },

    {
      title: "Experience",
      dataIndex: "experience",
      render: (experience: number) => (
        <span className="table-text">{experience} Years</span>
      ),
    },

    {
      title: "Ratings",
      dataIndex: "ratings",
      render: (ratings: number) => (
        <Tag color="gold">⭐ {ratings}</Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status: string, record: DoctorTable) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) =>
            updateDoctorStatus(record.doctorId, value)
          }
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />
      ),
    },

    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: unknown, record: DoctorTable) => (
        <Dropdown
          menu={{ items: getRowMenuItems(record) }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
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
            <AddButton label="+ Add Doctor" onClick={handleAddClick} />
          </Space>
        }
      />

      <Modal
        title={
          <div className="doctor-modal-title">
            <h2>{isEdit ? "Edit Doctor" : "Create Doctor"}</h2>
            <p>
              {isEdit
                ? "Update doctor profile and professional details"
                : "Add doctor profile and professional details"}
            </p>
          </div>
        }
        open={doctorModalOpen}
        footer={null}
        width={900}
        centered
        destroyOnClose
        onCancel={() => setDoctorModalOpen(false)}
        className="doctor-modal"
      >
        <form onSubmit={handleSave} className="doctor-form">
          <div className="doctor-modal-body">
            <div className="form-grid">
              {/* PROFILE */}
              <div className="form-group">
                <label>Profile Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setProfileImage(e.target.files[0]);
                    }
                  }}
                />

                {profileImage ? (
                  <div className="doctor-preview">
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt=""
                    />
                  </div>
                ) : existingImageUrl ? (
                  <div className="doctor-preview">
                    <img src={existingImageUrl} alt="" />
                  </div>
                ) : null}
              </div>

              {/* NAME */}
              <div className="form-group">
                <label>
                  Doctor Name<span>*</span>
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* GENDER */}
              <div className="form-group">
                <label>
                  Gender<span>*</span>
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label>
                  Email<span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label>
                  Password {!isEdit && <span>*</span>}
                </label>

                <input
                  type="password"
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleDoctorChange}
                  placeholder={
                    isEdit ? "Leave blank to keep unchanged" : ""
                  }
                  required={!isEdit}
                />
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label>
                  Phone<span>*</span>
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* DEPARTMENT */}
              <div className="form-group">
                <label>
                  Department<span>*</span>
                </label>

                <input
                  name="department"
                  value={formData.department}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* JOINING DATE */}
              <div className="form-group">
                <label>
                  Joining Date<span>*</span>
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* EXPERIENCE */}
              <div className="form-group">
                <label>
                  Experience<span>*</span>
                </label>

                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* HOSPITAL */}
              <div className="form-group">
                <label>
                  Hospital<span>*</span>
                </label>

                <input
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* RATINGS */}
              <div className="form-group">
                <label>
                  Ratings<span>*</span>
                </label>

                <input
                  type="number"
                  name="ratings"
                  value={formData.ratings}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* SUCCESS */}
              <div className="form-group">
                <label>
                  Success Rate<span>*</span>
                </label>

                <input
                  type="number"
                  name="successRate"
                  value={formData.successRate}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              {/* ADDRESS */}
              <div className="form-group full-width">
                <label>Address</label>

                <textarea
                  rows={4}
                  name="address"
                  value={formData.address}
                  onChange={handleDoctorChange}
                />
              </div>
            </div>

            {fetchingDoctor && (
              <p className="doctor-fetch-loading">
                Loading doctor details...
              </p>
            )}
          </div>

          <div className="doctor-modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setDoctorModalOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={doctorLoading || fetchingDoctor}
            >
              {doctorLoading
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                ? "Update Doctor"
                : "Save Doctor"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}