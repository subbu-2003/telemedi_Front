import { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Space,
  message,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

import {
  MoreOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import api from "../../../api/axios";

import { useNavigate } from "react-router-dom";

import DataTable from "../../../Utils/DataTable";
import AddButton from "../../../Utils/AddButton";

import "./Listprescription.css";

interface PrescriptionPoint {
  prescriptionPointsId: number;
  companyId: number;
  prescriptionId: number;
  pointsMessage: string;
}

interface Prescription {
  prescriptionId: number;
  companyId: number;
  doctorId: number;
  patientId: number;
  date: string;
  notes: string;
  prescriptionPoints: PrescriptionPoint[];
}

export default function ListPrescription() {
  const [data, setData] = useState<
    Prescription[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // ---------------- GET API ----------------
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/Prescription/company/1"
      );

      setData(response.data);

    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load prescriptions"
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = (
    prescriptionId: number
  ) => {
    const filtered = data.filter(
      (item) =>
        item.prescriptionId !==
        prescriptionId
    );

    setData(filtered);

    message.success(
      "Prescription removed"
    );
  };

  // ---------------- MENU ----------------
  const getRowMenuItems = (record: Prescription) => [
  {
  key: "share",
  label: "Share",
  icon: <ShareAltOutlined />,
  onClick: () => {
    const pdfUrl = `https://app-bgm-hospital-b4hbefbzd4ffbhhj.canadacentral-01.azurewebsites.net/api/Prescription/download-pdf/${record.prescriptionId}`;

    const message = `Prescription for ${record.patientId}\n\n${pdfUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  },
},

  {
    key: "edit",
    label: "Edit",
    icon: <EditOutlined />,
    onClick: () => {
      navigate("/createprescription", {
        state: {
          prescription: record,
        },
      });
    },
  },

  {
    key: "delete",
    label: "Delete",
    danger: true,
    icon: <DeleteOutlined />,
    onClick: () => {
      handleDelete(record.prescriptionId);
    },
  },
];

  // ---------------- TABLE ----------------
  const columns: ColumnsType<Prescription> =
    [
      {
        title: "Prescription ID",
        dataIndex: "prescriptionId",

        render: (id: number) => (
          <div className="prescription-id">
            <FileTextOutlined />

            <span>
              RX-{id}
            </span>
          </div>
        ),
      },

      {
        title: "Prescription Points",
        dataIndex:
          "prescriptionPoints",

        render: (
          points: PrescriptionPoint[]
        ) => (
          <div className="points-column">
            {points.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.prescriptionPointsId
                  }
                  className="point-item"
                >
                  <span className="point-number">
                    {index + 1}
                  </span>

                  <p>
                    {
                      item.pointsMessage
                    }
                  </p>
                </div>
              )
            )}
          </div>
        ),
      },

      {
        title: "Notes",
        dataIndex: "notes",

        render: (
          notes: string
        ) => (
          <Tooltip title={notes}>
            <div className="notes-text">
              {notes}
            </div>
          </Tooltip>
        ),
      },

      {
        title: "Date",
        dataIndex: "date",

        render: (
          date: string
        ) => (
          <span className="date-text">
            {new Date(
              date
            ).toLocaleDateString(
              "en-GB"
            )}
          </span>
        ),
      },

      {
        title: "Action",

        render: (
          _: unknown,
          record: Prescription
        ) => (
          <Dropdown
            menu={{
              items:
                getRowMenuItems(
                  record
                ),
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={
                <MoreOutlined />
              }
            />
          </Dropdown>
        ),
      },
    ];

  return (
    <div className="list-prescription-page">

      <DataTable<Prescription>
        title="Prescription List"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="prescriptionId"
        loading={loading}
        headerActions={
          <Space>

            <AddButton
              label="Add Prescription"
              onClick={() =>
                navigate(
                  "/createprescription"
                )
              }
            />

          </Space>
        }
      />

    </div>
  );
}