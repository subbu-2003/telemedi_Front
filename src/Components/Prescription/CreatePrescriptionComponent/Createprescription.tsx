import {
  useEffect,
  useState,
} from "react";

import {
  Select,
  message,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import api from "../../../api/axios";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Createprescription.css";

const { Option } = Select;

type PatientType = {
  patientId: number;
  patientName: string;
};

type PrescriptionPointType = {
  id: number;
  value: string;
  prescriptionPointsId?: number;
};

export default function CreatePrescription() {
  const navigate = useNavigate();

  const location = useLocation();

  const editData =
    location.state?.prescription;

  const isEdit = !!editData;

  const [loading, setLoading] =
    useState(false);

  const [patients, setPatients] =
    useState<PatientType[]>([]);

  const [patientId, setPatientId] =
    useState<number | null>(null);

  const [notes, setNotes] =
    useState("");

  const [pointInput, setPointInput] =
    useState("");

  const [
    prescriptionPoints,
    setPrescriptionPoints,
  ] = useState<
    PrescriptionPointType[]
  >([]);

  // ---------------- GET PATIENTS ----------------
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get(
        "/Patient/company/1"
      );

      setPatients(response.data);

    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load patients"
      );
    }
  };

  // ---------------- EDIT DATA ----------------
  useEffect(() => {
    if (editData) {
      setPatientId(
        editData.patientId
      );

      setNotes(editData.notes);

      setPrescriptionPoints(
        editData.prescriptionPoints.map(
          (item: any) => ({
            id:
              item.prescriptionPointsId,
            value:
              item.pointsMessage,
            prescriptionPointsId:
              item.prescriptionPointsId,
          })
        )
      );
    }
  }, [editData]);

  // ---------------- ADD POINT ----------------
  const addPoint = () => {
    if (!pointInput.trim()) {
      return;
    }

    const newPoint = {
      id: Date.now(),
      value: pointInput,
    };

    setPrescriptionPoints([
      ...prescriptionPoints,
      newPoint,
    ]);

    setPointInput("");
  };

  // ---------------- REMOVE POINT ----------------
  const removePoint = (
    id: number
  ) => {
    const filtered =
      prescriptionPoints.filter(
        (item) => item.id !== id
      );

    setPrescriptionPoints(filtered);
  };

  // ---------------- SAVE / UPDATE ----------------
  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!patientId) {
      message.error(
        "Please select patient"
      );

      return;
    }

    if (
      prescriptionPoints.length === 0
    ) {
      message.error(
        "Add prescription points"
      );

      return;
    }

    try {
      setLoading(true);

      const payload = {
        prescriptionId:
          isEdit
            ? editData.prescriptionId
            : 0,

        companyId: 1,

        doctorId: 1,

        patientId: patientId,

        date: isEdit
          ? editData.date
          : new Date().toISOString(),

        notes: notes,

        prescriptionPoints:
          prescriptionPoints.map(
            (item) => ({
              prescriptionPointsId:
                item.prescriptionPointsId ||
                0,

              companyId: 1,

              prescriptionId:
                isEdit
                  ? editData.prescriptionId
                  : 0,

              pointsMessage:
                item.value,
            })
          ),
      };

      if (isEdit) {
        await api.put(
          "/Prescription",
          payload
        );

        message.success(
          "Prescription Updated Successfully"
        );

      } else {
        await api.post(
          "/Prescription",
          payload
        );

        message.success(
          "Prescription Created Successfully"
        );
      }

      navigate(
        "/listprescription"
      );

    } catch (error) {
      console.log(error);

      message.error(
        isEdit
          ? "Failed to update prescription"
          : "Failed to create prescription"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prescription-page">

      <div className="prescription-container">

        {/* HEADER */}
        <div className="prescription-header">

          <h1>
            {isEdit
              ? "Update Prescription"
              : "Create Prescription"}
          </h1>

          <p>
            Add patient prescription
            details
          </p>

        </div>

        {/* FORM */}
        <form
          className="prescription-form"
          onSubmit={handleSave}
        >

          {/* PATIENT */}
          <div className="section patient-section">

            <h2>
              Patient Name 
               <span> *</span>
            </h2>

            <Select
              showSearch
              placeholder="Select Patient"
              className="patient-select"
              value={
                patientId || undefined
              }
              onChange={(value) =>
                setPatientId(value)
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

          {/* POINTS */}
          <div className="section">

            <div className="prescription-head">

              <h2>
                Prescription Points
                 <span> *</span>
              </h2>

              <button
                type="button"
                className="add-point-btn"
                onClick={addPoint}
              >
                <PlusOutlined />
                Add Point
              </button>

            </div>

            <div className="point-input-box">

              <input
                type="text"
                placeholder="Enter prescription point"
                value={pointInput}
                onChange={(e) =>
                  setPointInput(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="points-wrapper">

              {prescriptionPoints.map(
                (item, index) => (
                  <div
                    className="point-card"
                    key={item.id}
                  >

                    <div className="point-left">

                      <div className="point-number">
                        {index + 1}
                      </div>

                      <p>
                        {item.value}
                      </p>

                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removePoint(
                          item.id
                        )
                      }
                    >
                      <DeleteOutlined />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* NOTES */}
          <div className="section">

            <h2>
              Notes
            </h2>

            <textarea
              placeholder="Enter notes"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
            />

          </div>

          {/* SAVE */}
          <div className="save-section">

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Prescription"
                : "Save Prescription"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}