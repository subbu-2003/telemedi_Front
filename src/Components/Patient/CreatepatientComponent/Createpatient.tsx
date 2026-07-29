import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { message } from "antd";

import api from "../../../api/axios";

import "./Createpatient.css";

export default function CreatePatient() {
  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const editData =
    location.state?.patient;

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
  patientId: 0,

  patientName: "",

  phone: "",

  email: "",

  gender: "",

  bloodGroup: "",

  dob: "",

  address: "",

  emergencyNumber: "",

  disease: "",

  department: "General Medicine",

  status: "Active",

  insurance: "Not Added",

  registrationDate: "",

  companyId: 1,
});

// ---------------- SET EDIT DATA ----------------
useEffect(() => {
  if (editData) {
    setFormData({
      patientId: editData.patientId,

      patientName: editData.patientName ?? "",

      phone: editData.phone ?? "",

      email: editData.email ?? "",

      gender: editData.gender ?? "",

      bloodGroup: editData.bloodGroup ?? "",

      dob: editData.dob
        ? editData.dob.split("T")[0]
        : "",

      address: editData.address ?? "",

      emergencyNumber: editData.emergencyNumber ?? "",

      disease: editData.disease ?? "",

      department:
        editData.department || "General Medicine",

      status:
        editData.status || "Active",

      insurance:
        editData.insurance || "Not Added",

      registrationDate:
        editData.registrationDate ?? "",

      companyId:
        editData.companyId ?? 1,
    });
  }
}, [editData]);

  // ---------------- HANDLE CHANGE ----------------
 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement |
    HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  // ---------------- SAVE / UPDATE ----------------
const handleSave = async (
  e: React.FormEvent
) => {
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
    setLoading(true);

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
  companyId: formData.companyId,
};

    if (isEdit) {
      await api.put("/Patient", payload);

      message.success(
        "Patient Updated Successfully"
      );
    } else {
      await api.post("/Patient", payload);

      message.success(
        "Patient Created Successfully"
      );
    }

    navigate("/patientlist");
  } catch (error) {
    console.log(error);

    message.error(
      isEdit
        ? "Failed to update patient"
        : "Failed to create patient"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="create-patient-page">

      <div className="patient-container">

        {/* HEADER */}
        <div className="patient-header">

          <h1>
            {isEdit
              ? "Update Patient Profile"
              : "Create Patient Profile"}
          </h1>

          <div className="header-line"></div>

          <p>
            Enter patient details
            and medical information
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSave}
          className="patient-form"
        >

          <div className="form-grid">

            {/* Patient Name */}
            <div className="form-group">

              <label>
                Patient Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="patientName"
                value={
                  formData.patientName
                }
                onChange={
                  handleChange
                }
                placeholder="Enter patient name"
                required
              />

            </div>

            {/* Phone */}
            <div className="form-group">

              <label>
                Phone Number
                <span>*</span>
              </label>

              <input
                type="text"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                placeholder="Enter phone number"
                required
              />

            </div>

            {/* Email */}
            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Enter email address"
              />

            </div>

            {/* Gender */}
            <div className="form-group">

              <label>
                Gender
                <span>*</span>
              </label>

              <select
                name="gender"
                value={
                  formData.gender
                }
                onChange={
                  handleChange
                }
                required
              >
                <option value="">
                  Select Gender
                </option>

                <option>
                  Male
                </option>

                <option>
                  Female
                </option>

                <option>
                  Other
                </option>

              </select>

            </div>

            {/* Blood Group */}
            <div className="form-group">

              <label>
                Blood Group
                <span>*</span>
              </label>

              <select
                name="bloodGroup"
                value={
                  formData.bloodGroup
                }
                onChange={
                  handleChange
                }
                required
              >
                <option value="">
                  Select Blood Group
                </option>

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

            {/* DOB */}
            <div className="form-group">

              <label>
                Date of Birth
                <span>*</span>
              </label>

              <input
                type="date"
                name="dob"
                value={
                  formData.dob
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* Emergency */}
            <div className="form-group">

              <label>
                Emergency Number
              </label>

              <input
                type="text"
                name="emergencyNumber"
                value={
                  formData.emergencyNumber
                }
                onChange={
                  handleChange
                }
                placeholder="Emergency number"
              />

            </div>

            {/* Department */}
            <div className="form-group">

              <label>
                Department
              </label>

              <input
                type="text"
                name="department"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
                placeholder="Department"
              />

            </div>

            {/* Disease */}
            <div className="form-group">

              <label>
                Disease /
                Medical History
              </label>

              <input
                type="text"
                name="disease"
                value={
                  formData.disease
                }
                onChange={
                  handleChange
                }
                placeholder="Enter disease or medical history"
              />

            </div>

            {/* Status */}
<div className="form-group">

  <label>
    Status
    <span>*</span>
  </label>

  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    required
  >
    <option value="">
      Select Status
    </option>

    <option value="Active">
      Active
    </option>

    <option value="Inactive">
      Inactive
    </option>

  </select>

</div>

            {/* Address */}
            <div className="form-group full-width">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
                rows={5}
                placeholder="Enter patient address"
              />

            </div>

          </div>

          {/* FOOTER */}
          <div className="form-footer">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Patient"
                : "Save Patient"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}