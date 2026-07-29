// ✅ INSTALL THIS PACKAGE FIRST
// npm install face-api.js

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  Space,
  Avatar,
  Tag,
  Modal,
  message,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import * as faceapi from "face-api.js";

import DataTable from "../../Utils/DataTable";
import AddButton from "../../Utils/AddButton";

interface CameraData {
  id: number;
  photo: string;
  time: string;
  status: string;
}

export default function Camera() {
  const [data, setData] = useState<CameraData[]>([]);
  const [openCamera, setOpenCamera] = useState(false);
  const [checkMode, setCheckMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ───────────────────────────────────────────
  // LOAD FACE MODELS
  // ───────────────────────────────────────────
  useEffect(() => {
    loadModels();
    fetchData();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    console.log("✅ Face Models Loaded");
  };

  // ───────────────────────────────────────────
  // GET TABLE DATA
  // ───────────────────────────────────────────
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://localhost:7137/api/Camera/GetAll"
      );

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  // ───────────────────────────────────────────
  // OPEN CAMERA
  // ───────────────────────────────────────────
  const openCameraFunction = async (
    isCheckMode = false
  ) => {
    try {
      setCheckMode(isCheckMode);

      setOpenCamera(true);

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 300);
    } catch (error) {
      console.log(error);
      message.error("Camera access denied");
    }
  };

  // ───────────────────────────────────────────
  // CAPTURE NEW PHOTO
  // ───────────────────────────────────────────
  const handleCapture = async () => {
    try {
      if (!videoRef.current || !canvasRef.current)
        return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0);

      // ✅ FACE DETECT
      const detection =
        await faceapi.detectSingleFace(
          canvas,
          new faceapi.TinyFaceDetectorOptions()
        );

      if (!detection) {
        message.error("No face detected");
        return;
      }

      const blob: Blob = await new Promise(
        (resolve) =>
          canvas.toBlob(
            (blob) => resolve(blob as Blob),
            "image/png"
          )
      );

      const formData = new FormData();

      formData.append(
        "Photo",
        blob,
        `capture_${Date.now()}.png`
      );

      const response = await fetch(
        "https://localhost:7137/api/Camera/Create?Status=captured",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      stopCamera();

      setOpenCamera(false);

      await fetchData();

      message.success("Photo Saved");
    } catch (error) {
      console.log(error);
      message.error("Capture failed");
    }
  };

  // ───────────────────────────────────────────
  // CHECK FACE MATCH
  // ───────────────────────────────────────────
  const handleCheckPhoto = async () => {
    try {
      if (!videoRef.current || !canvasRef.current)
        return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0);

      // ✅ CURRENT FACE
      const currentDetection =
        await faceapi
          .detectSingleFace(
            canvas,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

      if (!currentDetection) {
        message.error("No face detected");
        return;
      }

      let matchedId: number | null = null;

      // ✅ LOOP DATABASE IMAGES
      for (const item of data) {
        const img = await faceapi.fetchImage(item.photo);

        const dbDetection =
          await faceapi
            .detectSingleFace(
              img,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!dbDetection) continue;

        const distance =
          faceapi.euclideanDistance(
            currentDetection.descriptor,
            dbDetection.descriptor
          );

        console.log("Distance:", distance);

        // ✅ MATCH THRESHOLD
        if (distance < 0.5) {
          matchedId = item.id;
          break;
        }
      }

      stopCamera();

      setOpenCamera(false);

      if (matchedId) {
        Modal.success({
          title: "Face Matched",
          content: `Matched ID: ${matchedId}`,
        });
      } else {
        Modal.error({
          title: "No Match",
          content: "Face not found",
        });
      }
    } catch (error) {
      console.log(error);
      message.error("Face check failed");
    }
  };

  // ───────────────────────────────────────────
  // STOP CAMERA
  // ───────────────────────────────────────────
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (
        videoRef.current.srcObject as MediaStream
      ).getTracks();

      tracks.forEach((track) => track.stop());
    }
  };

  // ───────────────────────────────────────────
  // ROW ACTIONS
  // ───────────────────────────────────────────
  const getRowMenuItems = (record: CameraData) => [
    {
      key: "delete",
      label: "Delete",
      onClick: () =>
        setData((prev) =>
          prev.filter((d) => d.id !== record.id)
        ),
    },
  ];

  // ───────────────────────────────────────────
  // TABLE COLUMNS
  // ───────────────────────────────────────────
  const columns: ColumnsType<CameraData> = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => (
        <Tag color="green">{id}</Tag>
      ),
    },
    {
      title: "Photo",
      dataIndex: "photo",
      render: (photo: string) => (
        <Avatar
          src={photo}
          size={60}
          shape="square"
        />
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (time: string) =>
        new Date(time).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color="green">{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: CameraData) => (
        <Dropdown
          menu={{ items: getRowMenuItems(record) }}
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <DataTable<CameraData>
        title="Camera Records"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="id"
        headerActions={
          <Space>
            {/* ✅ CHECK PHOTO BUTTON */}
            <Button
              type="default"
              onClick={() =>
                openCameraFunction(true)
              }
            >
              Check Photo
            </Button>

            {/* ✅ OPEN CAMERA BUTTON */}
            <AddButton
              label="Open Camera"
              onClick={() =>
                openCameraFunction(false)
              }
            />
          </Space>
        }
      />

      {/* CAMERA MODAL */}
      <Modal
        open={openCamera}
        footer={null}
        onCancel={() => {
          stopCamera();
          setOpenCamera(false);
        }}
        width={700}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              borderRadius: 10,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
          />

          {/* ✅ CONDITIONAL BUTTON */}
          {checkMode ? (
            <Button
              type="primary"
              size="large"
              style={{ marginTop: 20 }}
              onClick={handleCheckPhoto}
            >
              Check Face
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              style={{ marginTop: 20 }}
              onClick={handleCapture}
            >
              Capture Photo
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}