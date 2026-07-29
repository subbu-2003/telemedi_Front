import { useEffect, useState } from "react";

import {
  VideoCameraOutlined,
  FullscreenOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useSearchParams } from "react-router-dom";

import "./VideoStream.css";

export default function VideoStream() {
  const [searchParams] =
    useSearchParams();

  const [meetingUrl, setMeetingUrl] =
    useState("");

  const roomId =
    searchParams.get("room") || "";

  useEffect(() => {
    if (roomId) {
      // CONVERT TO MIROTALK URL
      const miroTalkUrl =
        `https://p2p.mirotalk.com/join?room=${roomId}`;

      setMeetingUrl(miroTalkUrl);
    }
  }, [roomId]);

  // FULLSCREEN
  const openFullscreen = () => {
    const iframe =
      document.getElementById(
        "meeting-frame"
      ) as HTMLIFrameElement;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="video-stream-page">

      {/* TOPBAR */}
      <div className="video-topbar">

        <div className="meeting-details">

          <div className="meeting-icon">
            <VideoCameraOutlined />
          </div>

          <div>
            <h2>
              Telemedicine Meeting
            </h2>

            <p>
              Room ID : {roomId}
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="meeting-actions">

          <button
            className="action-btn"
            onClick={openFullscreen}
          >
            <FullscreenOutlined />
          </button>

          <button
            className="end-btn"
            onClick={() =>
              window.close()
            }
          >
            <CloseOutlined />
            End
          </button>

        </div>

      </div>

      {/* VIDEO */}
      <div className="video-wrapper">

        {meetingUrl && (
          <iframe
            id="meeting-frame"
            src={meetingUrl}
            title="Video Meeting"
            allow="
              camera;
              microphone;
              fullscreen;
              display-capture
            "
            allowFullScreen
          />
        )}

      </div>

    </div>
  );
}