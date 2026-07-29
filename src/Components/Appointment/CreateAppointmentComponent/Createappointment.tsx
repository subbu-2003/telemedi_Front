import {
  useEffect,
  useState,
} from "react";

import {
  Select,
  message,
} from "antd";

import {
  VideoCameraOutlined,
  EyeOutlined,
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

            {/* DOCTOR */}
            <div className="form-group">

              <label>
                Doctor
              </label>

              <Select
                className="custom-select"
                value={
                  formData.doctorId
                }
                onChange={(
                  value
                ) =>
                  setFormData({
                    ...formData,
                    doctorId:
                      value,
                  })
                }
              >
                {doctors.map(
                  (doctor) => (
                    <Option
                      key={
                        doctor.doctorId
                      }
                      value={
                        doctor.doctorId
                      }
                    >
                      {doctor.name}
                    </Option>
                  )
                )}
              </Select>

            </div>

            {/* PATIENT */}
            <div className="form-group">

              <label>
                Patient
              </label>

              <Select
                className="custom-select"
                value={
                  formData.patientId
                }
                onChange={(
                  value
                ) =>
                  setFormData({
                    ...formData,
                    patientId:
                      value,
                  })
                }
              >
                {patients.map(
                  (patient) => (
                    <Option
                      key={
                        patient.patientId
                      }
                      value={
                        patient.patientId
                      }
                    >
                      {
                        patient.patientName
                      }
                    </Option>
                  )
                )}
              </Select>

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

      </div>
    </div>
  );
}