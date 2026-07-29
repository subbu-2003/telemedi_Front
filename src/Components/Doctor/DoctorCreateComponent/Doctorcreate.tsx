import {
  useEffect,
  useState,
} from "react";

import {
  message,
} from "antd";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../../../api/axios";

import "./Doctorcreate.css";

export default function Doctorcreate() {
  const [loading, setLoading] =
    useState(false);
  
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const doctorId =
    searchParams.get("id");

  const isEdit = !!doctorId;

 const [profileImage, setProfileImage] =
  useState<File | null>(null);

const [formData, setFormData] =
  useState({
    doctorId: 0,
    name: "",
    gender: "",
    email: "",
    passwordHash: "",
    phone: "",
    department: "",
    joiningDate: "",
    experience: "",
    address: "",
    ratings: "",
    successRate: "",
    hospital: "",
    profileImage: "",
    status: "Active",
    companyId: 1,
  });
  // ---------------- GET SINGLE DOCTOR ----------------
  useEffect(() => {
    if (doctorId) {
      fetchDoctorById();
    }
  }, [doctorId]);

 const fetchDoctorById = async () => {
  try {
    const response = await api.get(
      `/Doctor/${doctorId}`
    );

    const data = response.data;

    setFormData({
      doctorId: data.doctorId || 0,
      name: data.name || "",
      gender: data.gender || "",
      email: data.email || "",
      passwordHash: "",
      phone: data.phone || "",
      department:
        data.department || "",
      joiningDate:
        data.joiningDate?.split("T")[0] ||
        "",
      experience:
        data.experience?.toString() ||
        "",
      address: data.address || "",
      ratings:
        data.ratings?.toString() || "",
      successRate:
        data.successRate?.toString() ||
        "",
      hospital:
        data.hospital || "",
      profileImage:
        data.profileImage || "",
      status:
        data.status || "Active",
      companyId:
        data.companyId || 1,
    });
  } catch (error) {
    console.log(error);

    message.error(
      "Failed to load doctor"
    );
  }
};

const handleChange = (
  e:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
    | React.ChangeEvent<HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSave = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = new FormData();

    payload.append(
      "doctorId",
      isEdit
        ? doctorId!.toString()
        : "0"
    );

    payload.append(
      "name",
      formData.name
    );

    payload.append(
      "gender",
      formData.gender
    );

    payload.append(
      "email",
      formData.email
    );

    payload.append(
      "passwordHash",
      formData.passwordHash
    );

    payload.append(
      "phone",
      formData.phone
    );

    payload.append(
      "department",
      formData.department
    );

    payload.append(
      "joiningDate",
      formData.joiningDate
    );

    payload.append(
      "experience",
      formData.experience.toString()
    );

    payload.append(
      "address",
      formData.address
    );

    payload.append(
      "ratings",
      formData.ratings.toString()
    );

    payload.append(
      "successRate",
      formData.successRate.toString()
    );

    payload.append(
      "hospital",
      formData.hospital
    );

    payload.append(
      "status",
      formData.status
    );

    payload.append(
      "companyId",
      "1"
    );

    if (profileImage) {
      payload.append(
        "profileImage",
        profileImage
      );
    }

    if (!isEdit) {
      await api.post(
        "/Doctor",
        payload,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      message.success(
        "Doctor Created Successfully"
      );
    } else {
      await api.put(
        "/Doctor",
        payload,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      message.success(
        "Doctor Updated Successfully"
      );
    }

    navigate("/doctorlist");

  } catch (error: any) {
    console.log(error);

    message.error(
      error?.response?.data?.message ||
      "Something went wrong"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="doctor-page">

      <div className="doctor-container">

        {/* HEADER */}
        <div className="doctor-header">

          <h1>
            {isEdit
              ? "Update Doctor"
              : "Create Doctor"}
          </h1>

          <div className="header-line"></div>

          <p>
            Add doctor profile and
            professional details
          </p>

        </div>

        {/* FORM */}
        <form
          className="doctor-form"
          onSubmit={handleSave}
        >

          <div className="form-grid">
<div className="form-group">
  <label>
    Profile Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (
        e.target.files &&
        e.target.files.length > 0
      ) {
        setProfileImage(
          e.target.files[0]
        );
      }
    }}
  />

  {profileImage && (
    <div className="doctor-preview">
      <img
        src={URL.createObjectURL(
          profileImage
        )}
        alt="Doctor"
      />
    </div>
  )}

  {!profileImage &&
    formData.profileImage && (
      <div className="doctor-preview">
        <img
          src={
            formData.profileImage
          }
          alt="Doctor"
        />
      </div>
    )}
</div>
            {/* NAME */}
            <div className="form-group">

              <label>
                Doctor Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={
                  handleChange
                }
                placeholder="Enter doctor name"
                required
              />

            </div>

            {/* GENDER */}
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

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* EMAIL */}
            <div className="form-group">

              <label>
                Email
                <span>*</span>
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
                placeholder="Enter email"
                required
              />

            </div>

            <div className="form-group">
  <label>
    Password
    {!isEdit && <span>*</span>}
  </label>

  <input
    type="password"
    name="passwordHash"
    value={formData.passwordHash}
    onChange={handleChange}
    placeholder="Enter password"
    required={!isEdit}
  />
</div>

            {/* PHONE */}
            <div className="form-group">

              <label>
                Phone
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

            {/* DEPARTMENT */}
            <div className="form-group">

              <label>
                Department
                <span>*</span>
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
                placeholder="Enter department"
                required
              />

            </div>

            {/* JOINING DATE */}
            <div className="form-group">

              <label>
                Joining Date
                <span>*</span>
              </label>

              <input
                type="date"
                name="joiningDate"
                value={
                  formData.joiningDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* EXPERIENCE */}
            <div className="form-group">

              <label>
                Experience
                <span>*</span>
              </label>

              <input
                type="number"
                name="experience"
                value={
                  formData.experience
                }
                onChange={
                  handleChange
                }
                placeholder="Years of experience"
                required
              />

            </div>

            {/* HOSPITAL */}
            <div className="form-group">

              <label>
                Hospital
                 <span>*</span>
              </label>

              <input
                type="text"
                name="hospital"
                value={
                  formData.hospital
                }
                onChange={
                  handleChange
                }
                placeholder="Enter hospital name"
              />

            </div>

            {/* RATINGS */}
            <div className="form-group">

              <label>
                Ratings
                 <span>*</span>
              </label>

              <input
                type="number"
                name="ratings"
                value={
                  formData.ratings
                }
                onChange={
                  handleChange
                }
                placeholder="Ratings"
              />

            </div>

            {/* SUCCESS RATE */}
            <div className="form-group">

              <label>
                Success Rate %
                 <span>*</span>
              </label>

              <input
                type="number"
                name="successRate"
                value={
                  formData.successRate
                }
                onChange={
                  handleChange
                }
                placeholder="Success rate"
              />

            </div>

            {/* STATUS */}
            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {/* ADDRESS */}
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
                placeholder="Enter address"
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
                ? "Update Doctor"
                : "Save Doctor"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}