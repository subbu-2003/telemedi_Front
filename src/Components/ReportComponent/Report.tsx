import { useMemo, useState } from "react";

import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Select,
  Tag,
  message,
} from "antd";
import type { MenuProps } from "antd";

import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import dayjs, { Dayjs } from "dayjs";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import "./Report.css";

import api from "../../api/axios";

import DataTable from "../../Utils/DataTable";

/* ---------------------------------- Types ---------------------------------- */

type ServiceType =
  | "appointment"
  | "onlinePayment"
  | "cashPayment"
  | "patient";

interface AppointmentApiResponse {
  appointmentId: number;
  companyId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  date: string;
  appointmentType: string;
  consultationFee: number;
  status: string;
  paymentStatus: string;
}

interface AppointmentTable extends AppointmentApiResponse {
  key: number;
  sNo: number;
}

interface OnlinePaymentApiResponse {
  verificationId: number;
  companyId: number;
  patientId: number;
  patientName: string;
  appointmentId: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface OnlinePaymentTable extends OnlinePaymentApiResponse {
  key: number;
  sNo: number;
}

interface CashPaymentApiResponse {
  cashId: number;
  companyId: number;
  patientId: number;
  patientName: string;
  appointmentId: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface CashPaymentTable extends CashPaymentApiResponse {
  key: number;
  sNo: number;
}

interface PatientApiResponse {
  patientId: number;
  companyId: number;
  patientName: string;
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  department: string;
  disease: string;
  status: string;
  registrationDate: string;
  createdAt: string;
}

interface PatientTable extends PatientApiResponse {
  key: number;
  sNo: number;
}

/* --------------------------------- Helpers --------------------------------- */

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "captured":
    case "completed":
    case "paid cash":
    case "paid online":
    case "active":
      return "green";
    case "pending":
    case "unpaid":
      return "orange";
    case "cancelled":
    case "failed":
    case "inactive":
      return "red";
    default:
      return "blue";
  }
};

export default function Report() {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const companyId = admin.companyId || 1;

  const [service, setService] = useState<ServiceType | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().startOf("month")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  const [loading, setLoading] = useState(false);
  const [executed, setExecuted] = useState(false);

  const [appointmentData, setAppointmentData] = useState<AppointmentTable[]>(
    []
  );
  const [onlinePaymentData, setOnlinePaymentData] = useState<
    OnlinePaymentTable[]
  >([]);
  const [cashPaymentData, setCashPaymentData] = useState<CashPaymentTable[]>(
    []
  );
  const [patientData, setPatientData] = useState<PatientTable[]>([]);

  /* ------------------------------- Execute ------------------------------- */

  const handleExecute = async () => {
    if (!service) {
      message.warning("Please select a service.");
      return;
    }

    if (!fromDate || !toDate) {
      message.warning("Please select both From and To dates.");
      return;
    }

    if (toDate.isBefore(fromDate)) {
      message.warning("To date cannot be before From date.");
      return;
    }

    const formattedFrom = fromDate.format("YYYY-MM-DD");
    const formattedTo = toDate.format("YYYY-MM-DD");

    try {
      setLoading(true);
      setExecuted(false);

      if (service === "appointment") {
        const response = await api.get("/Report/Appointment", {
          params: {
            companyId,
            fromDate: formattedFrom,
            toDate: formattedTo,
          },
        });

        const formatted = (
          Array.isArray(response.data) ? response.data : []
        ).map((item: AppointmentApiResponse, index: number) => ({
          ...item,
          key: item.appointmentId,
          sNo: index + 1,
        }));

        setAppointmentData(formatted);
      } else if (service === "onlinePayment") {
        const response = await api.get("/Report/OnlinePayment", {
          params: {
            companyId,
            fromDate: formattedFrom,
            toDate: formattedTo,
          },
        });

        const formatted = (
          Array.isArray(response.data) ? response.data : []
        ).map((item: OnlinePaymentApiResponse, index: number) => ({
          ...item,
          key: item.verificationId,
          sNo: index + 1,
        }));

        setOnlinePaymentData(formatted);
      } else if (service === "cashPayment") {
        const response = await api.get("/Report/CashPayment", {
          params: {
            companyId,
            fromDate: formattedFrom,
            toDate: formattedTo,
          },
        });

        const formatted = (
          Array.isArray(response.data) ? response.data : []
        ).map((item: CashPaymentApiResponse, index: number) => ({
          ...item,
          key: item.cashId,
          sNo: index + 1,
        }));

        setCashPaymentData(formatted);
      } else {
        const response = await api.get("/Report/Patient", {
          params: {
            companyId,
            fromDate: formattedFrom,
            toDate: formattedTo,
          },
        });

        const formatted = (
          Array.isArray(response.data) ? response.data : []
        ).map((item: PatientApiResponse, index: number) => ({
          ...item,
          key: item.patientId,
          sNo: index + 1,
        }));

        setPatientData(formatted);
      }

      setExecuted(true);
    } catch (error) {
      console.log(error);
      message.error("Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- Columns -------------------------------- */

  const appointmentColumns: ColumnsType<AppointmentTable> = [
    { title: "S.No", dataIndex: "sNo", width: 70 },
    { title: "Appointment ID", dataIndex: "appointmentId" },
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (patientName: string) => (
        <div className="report-user">
          <Avatar size={38} icon={<UserOutlined />} />
          <span>{patientName}</span>
        </div>
      ),
    },
    { title: "Doctor", dataIndex: "doctorName" },
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY hh:mm A") : "-",
    },
    {
      title: "Type",
      dataIndex: "appointmentType",
      render: (type: string) => <Tag color="purple">{type}</Tag>,
    },
    {
      title: "Consultation Fee",
      dataIndex: "consultationFee",
      render: (amount: number) => <>₹{Number(amount).toLocaleString("en-IN")}</>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (paymentStatus: string) => (
        <Tag color={getStatusColor(paymentStatus)}>{paymentStatus}</Tag>
      ),
    },
  ];

  const onlinePaymentColumns: ColumnsType<OnlinePaymentTable> = [
    { title: "S.No", dataIndex: "sNo", width: 70 },
    { title: "Verification ID", dataIndex: "verificationId" },
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (patientName: string) => (
        <div className="report-user">
          <Avatar size={38} icon={<UserOutlined />} />
          <span>{patientName}</span>
        </div>
      ),
    },
    { title: "Appointment ID", dataIndex: "appointmentId" },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: number) => <>₹{Number(amount).toLocaleString("en-IN")}</>,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      render: (currency: string) => <Tag color="blue">{currency}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY hh:mm A") : "-",
    },
  ];

  const cashPaymentColumns: ColumnsType<CashPaymentTable> = [
    { title: "S.No", dataIndex: "sNo", width: 70 },
    { title: "Cash ID", dataIndex: "cashId" },
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (patientName: string) => (
        <div className="report-user">
          <Avatar size={38} icon={<UserOutlined />} />
          <span>{patientName}</span>
        </div>
      ),
    },
    { title: "Appointment ID", dataIndex: "appointmentId" },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: number) => <>₹{Number(amount).toLocaleString("en-IN")}</>,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      render: (currency: string) => <Tag color="blue">{currency}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY hh:mm A") : "-",
    },
  ];

  const patientColumns: ColumnsType<PatientTable> = [
    { title: "S.No", dataIndex: "sNo", width: 70 },
    { title: "Patient ID", dataIndex: "patientId" },
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (patientName: string) => (
        <div className="report-user">
          <Avatar size={38} icon={<UserOutlined />} />
          <span>{patientName}</span>
        </div>
      ),
    },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string) => email || "-",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender: string) => <Tag color="cyan">{gender}</Tag>,
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (bloodGroup: string) => (
        <Tag color="red">{bloodGroup?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "DOB",
      dataIndex: "dob",
      render: (dob: string) => (dob ? dayjs(dob).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (department: string) => department || "General",
    },
    {
      title: "Disease",
      dataIndex: "disease",
      render: (disease: string) => disease || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY hh:mm A") : "-",
    },
  ];

  const currentColumns: ColumnsType<any> =
    service === "appointment"
      ? appointmentColumns
      : service === "onlinePayment"
      ? onlinePaymentColumns
      : service === "cashPayment"
      ? cashPaymentColumns
      : service === "patient"
      ? patientColumns
      : [];

  const currentData: any[] =
    service === "appointment"
      ? appointmentData
      : service === "onlinePayment"
      ? onlinePaymentData
      : service === "cashPayment"
      ? cashPaymentData
      : service === "patient"
      ? patientData
      : [];

  /* -------------------------------- Titles -------------------------------- */

  const getReportTitle = () => {
    switch (service) {
      case "appointment":
        return "Appointment Report";
      case "onlinePayment":
        return "Online Payment Report";
      case "cashPayment":
        return "Cash Payment Report";
      case "patient":
        return "Patient Report";
      default:
        return "Select a service to view report";
    }
  };

  const getFileName = () => {
    const from = fromDate ? fromDate.format("YYYY-MM-DD") : "";
    const to = toDate ? toDate.format("YYYY-MM-DD") : "";
    const label =
      service === "appointment"
        ? "Appointment_Report"
        : service === "onlinePayment"
        ? "OnlinePayment_Report"
        : service === "cashPayment"
        ? "CashPayment_Report"
        : "Patient_Report";
    return `${label}_${from}_to_${to}`;
  };

  /* --------------------------------- Export -------------------------------- */

  const getExportData = (): Record<string, string | number>[] => {
    if (service === "appointment") {
      return appointmentData.map((item) => ({
        "S.No": item.sNo,
        "Appointment ID": item.appointmentId,
        Doctor: item.doctorName,
        Patient: item.patientName,
        Date: item.date ? dayjs(item.date).format("DD-MM-YYYY hh:mm A") : "-",
        Type: item.appointmentType,
        "Consultation Fee": item.consultationFee,
        Status: item.status,
        "Payment Status": item.paymentStatus,
      }));
    }

    if (service === "onlinePayment") {
      return onlinePaymentData.map((item) => ({
        "S.No": item.sNo,
        "Verification ID": item.verificationId,
        Patient: item.patientName,
        "Appointment ID": item.appointmentId,
        Amount: item.amount,
        Currency: item.currency,
        Status: item.status,
        "Created At": item.createdAt
          ? dayjs(item.createdAt).format("DD-MM-YYYY hh:mm A")
          : "-",
      }));
    }

    if (service === "cashPayment") {
      return cashPaymentData.map((item) => ({
        "S.No": item.sNo,
        "Cash ID": item.cashId,
        Patient: item.patientName,
        "Appointment ID": item.appointmentId,
        Amount: item.amount,
        Currency: item.currency,
        Status: item.status,
        "Created At": item.createdAt
          ? dayjs(item.createdAt).format("DD-MM-YYYY hh:mm A")
          : "-",
      }));
    }

    if (service === "patient") {
      return patientData.map((item) => ({
        "S.No": item.sNo,
        "Patient ID": item.patientId,
        Patient: item.patientName,
        Phone: item.phone,
        Email: item.email || "-",
        Gender: item.gender,
        "Blood Group": item.bloodGroup,
        DOB: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "-",
        Department: item.department || "General",
        Disease: item.disease || "-",
        Status: item.status,
        "Registration Date": item.registrationDate
          ? dayjs(item.registrationDate).format("DD-MM-YYYY hh:mm A")
          : "-",
      }));
    }

    return [];
  };

  const handleDownloadExcel = () => {
    const exportData = getExportData();

    if (exportData.length === 0) {
      message.warning("No data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${getFileName()}.xlsx`);
  };

  const handleDownloadPDF = () => {
    const exportData = getExportData();

    if (exportData.length === 0) {
      message.warning("No data to export.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const headers = Object.keys(exportData[0]);
    const rows = exportData.map((row) =>
      headers.map((header) => String(row[header] ?? "-"))
    );

    doc.setFontSize(14);
    doc.text(getReportTitle(), 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [24, 144, 255] },
    });

    doc.save(`${getFileName()}.pdf`);
  };

  const downloadMenuItems: MenuProps["items"] = [
    { key: "pdf", label: "Download PDF", icon: <FilePdfOutlined /> },
    { key: "excel", label: "Download Excel", icon: <FileExcelOutlined /> },
  ];

  const handleDownloadMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "pdf") handleDownloadPDF();
    else if (key === "excel") handleDownloadExcel();
  };

  const showDownload = useMemo(
    () => executed && !loading && currentData.length > 0,
    [executed, loading, currentData]
  );

  /* --------------------------------- Render -------------------------------- */

  return (
    <div className="report-page">
      <div className="report-filter-bar">
        <div className="filter-item">
          <label>Service</label>
          <Select
            placeholder="Select Service"
            style={{ width: 220 }}
            value={service}
            onChange={(value: ServiceType) => {
              setService(value);
              setExecuted(false);
            }}
            options={[
              { value: "appointment", label: "Appointment" },
              { value: "onlinePayment", label: "Online Payment" },
              { value: "cashPayment", label: "Cash Payment" },
              { value: "patient", label: "Patient" },
            ]}
          />
        </div>

        <div className="filter-item">
          <label>From</label>
          <DatePicker
            value={fromDate}
            onChange={(date) => setFromDate(date)}
            format="DD-MM-YYYY"
            allowClear={false}
          />
        </div>

        <div className="filter-item">
          <label>To</label>
          <DatePicker
            value={toDate}
            onChange={(date) => setToDate(date)}
            format="DD-MM-YYYY"
            allowClear={false}
          />
        </div>

        <div className="filter-item filter-actions">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleExecute}
            loading={loading}
          >
            Execute
          </Button>

          {showDownload && (
            <Dropdown
              menu={{
                items: downloadMenuItems,
                onClick: handleDownloadMenuClick,
              }}
              placement="bottomRight"
            >
              <Button icon={<DownloadOutlined />}>Download</Button>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="report-table-wrapper">
        <DataTable<any>
          title={getReportTitle()}
          count={currentData.length}
          columns={currentColumns}
          data={currentData}
          rowKey="key"
          loading={loading}
        />
      </div>
    </div>
  );
}