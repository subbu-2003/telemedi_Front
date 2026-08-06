import {
  useEffect,
  useState,
} from "react";

import {
  Button,
  Select,
  message,
  Modal,
} from "antd";

import {
  VideoCameraOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../../../api/axios";

import "./Createappointment.css";

const { Option } = Select;

interface PatientType {
  patientId: number;
  patientName: string;
}

interface DoctorType {
  doctorId: number;
  name: string;
}

export default function Createappointment() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const editData =
    location.state;

  const isEdit =
    !!editData;

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  const [doctorLoading, setDoctorLoading] = useState(false);

const [profileImage, setProfileImage] =
  useState<File | null>(null);

const [doctorForm, setDoctorForm] = useState({
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
});

const [patientModalOpen, setPatientModalOpen] =
  useState(false);

const [patientLoading, setPatientLoading] =
  useState(false);

const [patientForm, setPatientForm] =
  useState({
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
  });
    
  const [loading, setLoading] =
    useState(false);

  const [patients, setPatients] =
    useState<PatientType[]>([]);

  const [doctors, setDoctors] =
    useState<DoctorType[]>([]);

  const [formData, setFormData] =
    useState({
      appointmentId: 0,

      doctorId: undefined as
        | number
        | undefined,

      patientId: undefined as
        | number
        | undefined,

      date: "",

      meetingLink: "",

      status: "Pending",

      note: "",

      appointmentType:
        "Online",

      tokenNumber: "",

      consultationFee: "",
    });

  // LOAD EDIT DATA
  useEffect(() => {
    if (editData) {
      setFormData({
        appointmentId:
          editData.appointmentId,

        doctorId:
          editData.doctorId,

        patientId:
          editData.patientId,

        date:
          editData.date.slice(
            0,
            16
          ),

        meetingLink:
          editData.meetingLink,

        status:
          editData.status,

        note: editData.note,

        appointmentType:
          editData.appointmentType,

        tokenNumber:
          String(
            editData.tokenNumber
          ),

        consultationFee:
          String(
            editData.consultationFee
          ),
      });
    }
  }, [editData]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients =
    async () => {
      const response =
        await api.get(
          "/Patient/company/1"
        );

      setPatients(
        response.data
      );
    };

  const fetchDoctors =
    async () => {
      const response =
        await api.get(
          "/Doctor/company/1"
        );

      setDoctors(
        response.data
      );
    };

  // INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleDoctorChange = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement |
    HTMLTextAreaElement
  >
) => {
  setDoctorForm({
    ...doctorForm,
    [e.target.name]: e.target.value,
  });
};

const handlePatientChange = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement |
    HTMLTextAreaElement
  >
) => {
  setPatientForm({
    ...patientForm,
    [e.target.name]: e.target.value,
  });
};


const saveDoctor = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    setDoctorLoading(true);

    const admin = JSON.parse(
      localStorage.getItem("admin")!
    );

    const form = new FormData();

    form.append("CompanyId", admin.companyId);

    form.append("Name", doctorForm.name);

    form.append("Gender", doctorForm.gender);

    form.append("Email", doctorForm.email);

    form.append(
      "PasswordHash",
      doctorForm.passwordHash
    );

    form.append("Phone", doctorForm.phone);

    form.append(
      "Department",
      doctorForm.department
    );

    form.append(
      "JoiningDate",
      doctorForm.joiningDate
    );

    form.append(
      "Experience",
      doctorForm.experience.toString()
    );

    form.append(
      "Hospital",
      doctorForm.hospital
    );

    form.append(
      "Ratings",
      doctorForm.ratings.toString()
    );

    form.append(
      "SuccessRate",
      doctorForm.successRate.toString()
    );

    form.append(
      "Address",
      doctorForm.address
    );

    form.append(
      "Status",
      doctorForm.status
    );

    if (profileImage) {

      form.append(
        "ProfileImage",
        profileImage
      );

    }

    await api.post(
      "/Doctor",
      form,
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

    setDoctorModalOpen(false);

    fetchDoctors();

  } catch {

    message.error(
      "Unable to create doctor"
    );

  } finally {

    setDoctorLoading(false);

  }

};

const savePatient = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setPatientLoading(true);

    const admin = JSON.parse(
      localStorage.getItem("admin") || "{}"
    );

    await api.post("/Patient", {
      ...patientForm,
      companyId: admin.companyId,
    });

    message.success("Patient Created");

    setPatientModalOpen(false);

    setPatientForm({
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
    });

    fetchPatients();

  } catch {
    message.error(
      "Unable to create patient"
    );
  } finally {
    setPatientLoading(false);
  }
};

  // GENERATE MEETING
  const generateMeeting =
    () => {
      const randomRoom =
        Math.random()
          .toString(36)
          .substring(2, 10);

      const currentDomain =
        window.location.origin;

      const customMeetingLink =
        `${currentDomain}/videostream?room=${randomRoom}`;

      setFormData({
        ...formData,

        meetingLink:
          customMeetingLink,
      });

      message.success(
        "Meeting generated"
      );
    };

  // JOIN MEETING
  const openMeeting = () => {
    window.open(
      formData.meetingLink,
      "_blank"
    );
  };

  // SAVE
  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        appointmentId:
          formData.appointmentId,

        companyId: 1,

        doctorId:
          formData.doctorId,

        patientId:
          formData.patientId,

        date: new Date(
          formData.date
        ).toISOString(),

        meetingLink:
          formData.meetingLink,

        status:
          formData.status,

        note:
          formData.note,

        appointmentType:
          formData.appointmentType,

        tokenNumber:
          Number(
            formData.tokenNumber
          ),

        consultationFee:
          Number(
            formData.consultationFee
          ),

        createdDate:
          new Date().toISOString(),

        updatedDate:
          new Date().toISOString(),
      };

      // CREATE
      if (!isEdit) {

        await api.post(
          "/Appointment",
          payload
        );

        message.success(
          "Appointment Created"
        );

      } else {

        // UPDATE
        await api.put(
          "/Appointment",
          payload
        );

        message.success(
          "Appointment Updated"
        );
      }

     navigate("/listappointment");

    } catch (error) {
      console.log(error);

      message.error(
        "Save failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-page">

      <div className="appointment-container">

        <div className="appointment-header">

          <h1>
            {isEdit
              ? "Edit Appointment"
              : "Create Appointment"}
          </h1>

          <div className="header-line"></div>

        </div>

        <form
          className="appointment-form"
          onSubmit={handleSave}
        >

          <div className="form-grid">

   <div className="form-group">

<label>Doctor</label>

<div className="input-with-button">

<Select
    className="custom-select"
    value={formData.doctorId}
    onChange={(value)=>
        setFormData({
            ...formData,
            doctorId:value
        })
    }
>

{doctors.map((doctor)=>(

<Option
key={doctor.doctorId}
value={doctor.doctorId}
>

{doctor.name}

</Option>

))}

</Select>

<Button
type="primary"
icon={<PlusOutlined />}
className="add-btn"
onClick={()=>
setDoctorModalOpen(true)
}
/>

</div>

</div>
     
          {/* PATIENT */}
<div className="form-group">
  <label>Patient</label>

  <div className="input-with-button">
    <Select
      className="custom-select"
      value={formData.patientId}
      onChange={(value) =>
        setFormData({
          ...formData,
          patientId: value,
        })
      }
    >
      {patients.map((patient) => (
        <Option
          key={patient.patientId}
          value={patient.patientId}
        >
          {patient.patientName}
        </Option>
      ))}
    </Select>

   <Button
  type="primary"
  icon={<PlusOutlined />}
  className="add-btn"
  onClick={() => setPatientModalOpen(true)}
/>
  </div>
</div>

            {/* DATE */}
            <div className="form-group">
              <label>
                Appointment Date
              </label>

              <input
                type="datetime-local"
                name="date"
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
              />
            </div>

            {/* TYPE */}
            <div className="form-group">
              <label>
                Appointment Type
              </label>

              <select
                name="appointmentType"
                value={
                  formData.appointmentType
                }
                onChange={
                  handleChange
                }
              >
                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
                </option>

              </select>
            </div>

            {/* FEE */}
            <div className="form-group">
              <label>
                Consultation Fee
              </label>

              <input
                type="number"
                name="consultationFee"
                value={
                  formData.consultationFee
                }
                onChange={
                  handleChange
                }
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
                <option value="Pending">
                  Pending
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>
            </div>

            {/* MEETING LINK */}
            <div className="form-group">

              <label>
                Meeting Link
              </label>

              <div className="meeting-input-wrapper">

                <input
                  type="text"
                  name="meetingLink"
                  value={
                    formData.meetingLink
                  }
                  onChange={
                    handleChange
                  }
                />

                <button
                  type="button"
                  className="meeting-btn"
                  onClick={
                    generateMeeting
                  }
                >
                  <VideoCameraOutlined />
                  Generate
                </button>

                {formData.meetingLink && (
                  <button
                    type="button"
                    className="join-btn"
                    onClick={
                      openMeeting
                    }
                  >
                    <EyeOutlined />
                    Join
                  </button>
                )}

              </div>
            </div>

            {/* NOTE */}
            <div className="form-group full-width">

              <label>
                Note
              </label>

              <textarea
                name="note"
                rows={5}
                value={
                  formData.note
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

          <div className="form-footer">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Appointment"
                : "Save Appointment"}
            </button>

          </div>

        </form>

<Modal
  title={
    <div className="doctor-modal-title">
      <h2>Create Doctor</h2>
      <p>Add doctor profile and professional details</p>
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

<form
    onSubmit={saveDoctor}
    className="doctor-form"
>

<div className="doctor-modal-body">

<div className="form-grid">

{/* PROFILE */}

<div className="form-group">

<label>Profile Image</label>

<input
type="file"
accept="image/*"
onChange={(e)=>{

if(e.target.files){

setProfileImage(
e.target.files[0]
);

}

}}
/>

{profileImage && (

<div className="doctor-preview">

<img
src={URL.createObjectURL(profileImage)}
alt=""
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
name="name"
value={doctorForm.name}
onChange={handleDoctorChange}
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
value={doctorForm.gender}
onChange={handleDoctorChange}
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
value={doctorForm.email}
onChange={handleDoctorChange}
required
/>

</div>

{/* PASSWORD */}

<div className="form-group">

<label>
Password
<span>*</span>
</label>

<input
type="password"
name="passwordHash"
value={doctorForm.passwordHash}
onChange={handleDoctorChange}
required
/>

</div>

{/* PHONE */}

<div className="form-group">

<label>
Phone
<span>*</span>
</label>

<input
name="phone"
value={doctorForm.phone}
onChange={handleDoctorChange}
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
name="department"
value={doctorForm.department}
onChange={handleDoctorChange}
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
value={doctorForm.joiningDate}
onChange={handleDoctorChange}
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
value={doctorForm.experience}
onChange={handleDoctorChange}
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
name="hospital"
value={doctorForm.hospital}
onChange={handleDoctorChange}
required
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
value={doctorForm.ratings}
onChange={handleDoctorChange}
required
/>

</div>

{/* SUCCESS */}

<div className="form-group">

<label>
Success Rate
<span>*</span>
</label>

<input
type="number"
name="successRate"
value={doctorForm.successRate}
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
value={doctorForm.address}
onChange={handleDoctorChange}
/>

</div>

</div>

</div>

<div className="doctor-modal-footer">

<button
type="button"
className="cancel-btn"
onClick={() =>
setDoctorModalOpen(false)
}
>
Cancel
</button>

<button
type="submit"
className="save-btn"
disabled={doctorLoading}
>

{doctorLoading
? "Saving..."
: "Save Doctor"}

</button>

</div>

</form>

</Modal>


<Modal
  title={
    <div className="doctor-modal-title">
      <h2>Create Patient</h2>
      <p>Add patient information and medical details</p>
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
  <form
    onSubmit={savePatient}
    className="doctor-form"
  >
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
            value={patientForm.patientName}
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
            value={patientForm.phone}
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
            value={patientForm.email}
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
            value={patientForm.gender}
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
            value={patientForm.bloodGroup}
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
            value={patientForm.dob}
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
            value={patientForm.emergencyNumber}
            onChange={handlePatientChange}
          />
        </div>

        {/* Department */}
        <div className="form-group">
          <label>Department</label>

          <input
            type="text"
            name="department"
            value={patientForm.department}
            onChange={handlePatientChange}
          />
        </div>

        {/* Disease */}
        <div className="form-group">
          <label>Disease</label>

          <input
            type="text"
            name="disease"
            value={patientForm.disease}
            onChange={handlePatientChange}
          />
        </div>

        {/* Insurance */}
        <div className="form-group">
          <label>Insurance</label>

          <input
            type="text"
            name="insurance"
            value={patientForm.insurance}
            onChange={handlePatientChange}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={patientForm.status}
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
            value={patientForm.address}
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
        {patientLoading ? "Saving..." : "Save Patient"}
      </button>

    </div>

  </form>
</Modal>
      </div>
    </div>
  );
}