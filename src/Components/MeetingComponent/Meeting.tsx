import { useState, useEffect } from "react";

import {
  VideoCameraOutlined,
  CopyOutlined,
  CheckCircleFilled,
  ShareAltOutlined,
  SearchOutlined,
  WhatsAppOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { message, Spin } from "antd";

import api from "../../api/axios";

import "./Meeting.css";

interface Patient {
  patientId: number;
  patientName: string;
  phone: string;
  email: string;
}

export default function Meeting() {
  const [meetingLink, setMeetingLink] =
    useState("");

  const [roomId, setRoomId] =
    useState("");

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [filteredPatients, setFilteredPatients] =
    useState<Patient[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [openPopup, setOpenPopup] =
    useState(false);

  // GENERATE MEETING
  const generateMeeting = () => {
    const randomRoom = Math.random()
      .toString(36)
      .substring(2, 10);

    setRoomId(randomRoom);

    const domain =
      window.location.origin;

    const customLink =
      `${domain}/videostream?room=${randomRoom}`;

    setMeetingLink(customLink);

    message.success(
      "Meeting generated successfully"
    );
  };

  // COPY LINK
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        meetingLink
      );

      message.success("Link copied");

    } catch {
      message.error("Failed to copy");
    }
  };

  // JOIN MEETING
  const joinMeeting = () => {
    window.open(meetingLink, "_blank");
  };

  // FETCH PATIENTS
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/Patient/company/1"
      );

      setPatients(response.data);

      setFilteredPatients(
        response.data
      );

    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load patients"
      );

    } finally {
      setLoading(false);
    }
  };

  // OPEN SHARE POPUP
  const openSharePopup = () => {
    if (!meetingLink) {
      message.warning(
        "Generate meeting first"
      );

      return;
    }

    setOpenPopup(true);

    if (patients.length === 0) {
      fetchPatients();
    }
  };

  // SEARCH
  useEffect(() => {
    const filtered = patients.filter(
      (item) =>
        item.patientName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.phone.includes(search) ||
        item.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

    setFilteredPatients(filtered);

  }, [search, patients]);

  // WHATSAPP SHARE
  const shareWhatsapp = (
    patient: Patient
  ) => {
    const text = `Hello ${patient.patientName},

Your telemedicine meeting link:

${meetingLink}`;

    window.open(
      `https://wa.me/${patient.phone}?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  };

  // EMAIL SHARE
//   const shareEmail = (
//     patient: Patient
//   ) => {
//     const subject =
//       "Telemedicine Meeting Link";

//     const body = `Hello ${patient.patientName},

// Your meeting link:

// ${meetingLink}`;

//     window.open(
//       `mailto:${patient.email}?subject=${encodeURIComponent(
//         subject
//       )}&body=${encodeURIComponent(
//         body
//       )}`
//     );
//   };

  return (
    <div className="meeting-page">

      <div className="meeting-container">

        {/* ICON */}
        <div className="meeting-icon-box">
          <VideoCameraOutlined className="meeting-icon" />
        </div>

        {/* HEADER */}
        <div className="meeting-header">

          <h1>
            Create Video Meeting
          </h1>

          <p>
            Generate secure telemedicine meeting links
          </p>

        </div>

        {/* GENERATE BUTTON */}
        <button
          className="generate-btn"
          onClick={generateMeeting}
        >
          Generate Meeting Link
        </button>

        {/* MEETING CARD */}
        {meetingLink && (
          <div className="meeting-card">

            <div className="meeting-card-header">

              <div>

                <h2>
                  Meeting Ready
                </h2>

                <p>
                  Share this link with patient
                </p>

              </div>

              <CheckCircleFilled className="success-icon" />

            </div>

            {/* ROOM */}
            <div className="room-id-box">

              <span>
                Room ID
              </span>

              <p>
                {roomId}
              </p>

            </div>

            {/* LINK */}
            <div className="link-box">

              <input
                type="text"
                value={meetingLink}
                readOnly
              />

              <button onClick={copyLink}>
                <CopyOutlined />
              </button>

            </div>

            {/* ACTIONS */}
            <div className="meeting-actions">

              <button
                className="join-btn"
                onClick={joinMeeting}
              >
                Join Meeting
              </button>

              <button
                className="share-btn"
                onClick={openSharePopup}
              >
                <ShareAltOutlined />
                Share
              </button>

            </div>

          </div>
        )}

      </div>

      {/* POPUP */}
      {openPopup && (
        <div className="popup-overlay">

          <div className="popup-container">

            {/* HEADER */}
            <div className="popup-header">

              <h2>
                Share Meeting
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setOpenPopup(false)
                }
              >
                <CloseOutlined />
              </button>

            </div>

            {/* SEARCH */}
            <div className="search-box">

              <SearchOutlined />

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* PATIENT LIST */}
            <div className="patient-list">

              {loading ? (
                <div className="loading-box">
                  <Spin />
                </div>

              ) : filteredPatients.length === 0 ? (

                <div className="empty-box">
                  No patients found
                </div>

              ) : (

                filteredPatients.map(
                  (patient) => (

                    <div
                      className="patient-card"
                      key={patient.patientId}
                    >

                      <div className="patient-left">

                        <div className="patient-avatar">
                          {patient.patientName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="patient-details">

                          <h3>
                            {patient.patientName}
                          </h3>

                          <p>
                            {patient.phone}
                          </p>

                          <p>
                            {patient.email}
                          </p>

                        </div>

                      </div>

                      <div className="patient-actions">

                        <button
                          className="icon-btn whatsapp"
                          onClick={() =>
                            shareWhatsapp(patient)
                          }
                        >
                          <WhatsAppOutlined />
                        </button>

                 

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}