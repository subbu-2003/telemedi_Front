import { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import {
  Button,
  Dropdown,
  Space,
  Tag,
  Tooltip,
  Select,
  message,
} from "antd";

import { useNavigate } from "react-router-dom";

import {
  MoreOutlined,
  VideoCameraOutlined,
  CopyOutlined,
  WhatsAppOutlined,
  WalletOutlined,
  LinkOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";
import api from "../../../api/axios";

import DataTable from "../../../Utils/DataTable";
import AddButton from "../../../Utils/AddButton";

import "./Listappointment.css";
interface AppointmentApi {
  appointmentId: number;
  companyId: number;

  doctorId: number;
  doctorName: string;

  patientId: number;
  patientName: string;

  date: string;

  meetingLink: string;

  status: string;

  paymentStatus: string;

  note: string;

  appointmentType: string;

  tokenNumber: number;

  consultationFee: number;

  createdDate: string;

  updatedDate: string;
}
interface AppointmentTable {
  key: number;

  appointmentId: number;
  companyId: number;

  doctorId: number;
  doctorName: string;

  patientId: number;
  patientName: string;

  date: string;
  meetingLink: string;

  status: string;
  note: string;

  appointmentType: string;
  tokenNumber: number;
  consultationFee: number;

  paymentStatus?: string;

  createdDate: string;
  updatedDate: string;

  fullData?: any;
}

export default function Listappointment() {
  const [data, setData] =
    useState<AppointmentTable[]>([]);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= FETCH APPOINTMENTS =================
 const fetchAppointments = async () => {
  try {
    setLoading(true);

    const userType = localStorage.getItem("userType");
    const companyId = localStorage.getItem("companyId") || "1";

    let response;

    if (userType === "ADMIN") {
      response = await api.get(`/Appointment/company/${companyId}`);
    } else if (userType === "DOCTOR") {
      const doctorId = localStorage.getItem("doctorId");

      response = await api.get(
        `/Appointment/company/${companyId}/doctor/${doctorId}`
      );
    }

    const appointments =
      userType === "DOCTOR"
        ? response?.data.appointments
        : response?.data;

    const formattedData = appointments.map(
      (item: AppointmentApi) => ({
        key: item.appointmentId,

        appointmentId: item.appointmentId,

        companyId: item.companyId,

        doctorId: item.doctorId,
        doctorName: item.doctorName,

        patientId: item.patientId,
        patientName: item.patientName,

        date: new Date(item.date).toLocaleString(),

        meetingLink: item.meetingLink,

        status: item.status,

        
        paymentStatus: item.paymentStatus,

        appointmentType: item.appointmentType,

        consultationFee: item.consultationFee,

        fullData: item,
      })
    );

    setData(formattedData);
  } catch (error) {
    console.log(error);
    message.error("Failed to load appointments");
  } finally {
    setLoading(false);
  }
};

const handleCashPayment = async (
  record: AppointmentTable
) => {
  try {
    // 1. Save Cash Payment
    await api.post("/Paymentcash", {
      companyId: record.companyId,
      patientId: record.patientId,
      appointmentId: record.appointmentId,
      amount: record.consultationFee,
      currency: "INR",
      status: "CAPTURED",
      capturedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // 2. Update Appointment Payment Status
    await api.put("/Appointment/UpdatePaymentStatus", {
      appointmentId: record.appointmentId,
      companyId: record.companyId,
      paymentStatus: "Paid Cash",
    });

    // 3. Success Message
    message.success("Cash payment received successfully.");

    // 4. Reload Appointment List
    fetchAppointments();
  } catch (error) {
    console.error(error);
    message.error("Cash payment failed.");
  }
};

const createRazorpayOrder = async (record: AppointmentTable) => {
  try {
    const payload = {
      companyId: record.companyId,
      patientId: record.patientId,
      appointmentId: record.appointmentId,
      amount: record.consultationFee,
    };

    const response = await api.post("/Razorpay/CreateOrder", payload);

    if (!response.data.success) {
      message.error("Failed to create Razorpay order.");
      return;
    }

    const orderId = response.data.orderId;

    const options = {
      key: "rzp_live_T5oDUgEbVrmRdY", // Replace with your Razorpay Key ID
      amount: record.consultationFee * 100, // Amount in paise
      currency: "INR",
      name: "Telemedicine",
      description: "Appointment Payment",
      order_id: orderId,

    handler: async function (paymentResponse: any) {
  try {
    // 1. Verify the payment
    const verifyResponse = await api.post("/Razorpay/VerifyAndCapture", {
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,

      companyId: record.companyId,
      patientId: record.patientId,
      appointmentId: record.appointmentId,
      amount: record.consultationFee,
      currency: "INR",
    });

    // 2. If verification succeeded, update appointment payment status
    if (
      verifyResponse.data.success &&
      verifyResponse.data.data.status === "CAPTURED"
    ) {
      await api.put("/Appointment/UpdatePaymentStatus", {
        appointmentId: record.appointmentId,
        companyId: record.companyId,
        paymentStatus: "Paid Online",
      });

      message.success("Payment Successful");

      fetchAppointments();
    } else {
      message.error("Payment verification failed.");
    }
  } catch (err) {
    console.error(err);
    message.error("Payment verification failed.");
  }
},

      prefill: {
        name: record.patientName,
      },

      theme: {
        color: "#1677ff",
      },

      modal: {
        ondismiss: function () {
          message.info("Payment cancelled.");
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.open();
  } catch (error) {
    console.error(error);
    message.error("Unable to create Razorpay order.");
  }
};

const generatePaymentLink = async (record: AppointmentTable) => {
  try {

    const response = await api.post(
      "/Razorpay/GeneratePaymentLink",
      {
        companyId: record.companyId,
        patientId: record.patientId,
        appointmentId: record.appointmentId,
        amount: record.consultationFee,
      }
    );

    if (!response.data.success) {
      message.error("Unable to generate payment link.");
      return;
    }

    const paymentLink = response.data.paymentLink;

    await navigator.clipboard.writeText(paymentLink);

    message.success("Payment link copied successfully.");

  } catch (err) {

    console.error(err);

    message.error("Unable to generate payment link.");

  }
};

  // ================= GENERATE MEETING =================
 const generateMeetingLink = async (
  record: AppointmentTable
) => {
  try {
    /**
     * RANDOM ROOM ID
     */

    const randomRoom =
      Math.random()
        .toString(36)
        .substring(2, 10);

    /**
     * CURRENT RUNNING DOMAIN
     * Example:
     * http://localhost:5173
     */

    const currentDomain =
      window.location.origin;

    /**
     * CUSTOM MEETING LINK
     * THIS WILL STORE IN DATABASE
     */

    const customMeetingLink =
      `${currentDomain}/videostream?room=${randomRoom}`;

    /**
     * UPDATE API PAYLOAD
     */

    const updatedPayload = {
      appointmentId:
        record.appointmentId,

      meetingLink:
        customMeetingLink,
    };

    /**
     * UPDATE MEETING LINK API
     */

    await api.put(
      "/Appointment/meeting-link",
      updatedPayload
    );

    /**
     * UPDATE TABLE STATE
     */

    const updatedData = data.map(
      (item) => {
        if (
          item.appointmentId ===
          record.appointmentId
        ) {
          return {
            ...item,

            meetingLink:
              customMeetingLink,

            fullData: {
              ...item.fullData,

              meetingLink:
                customMeetingLink,
            },
          };
        }

        return item;
      }
    );

    setData(updatedData);

    /**
     * OPEN MIROTALK ROOM
     */

 

    message.success(
      "Meeting generated successfully"
    );

  } catch (error) {
    console.log(error);

    message.error(
      "Failed to generate meeting link"
    );
  }
};



const updateAppointmentStatus = async (
  appointmentId: number,
  status: string
) => {
  try {
    const payload = {
      appointmentId,
      status,
    };

    await api.put(
      "/Appointment/update-status",
      payload
    );

    setData((prev) =>
      prev.map((item) =>
        item.appointmentId === appointmentId
          ? {
              ...item,
              status,
              fullData: {
                ...item.fullData,
                status,
              },
            }
          : item
      )
    );

    message.success(
      "Status updated successfully"
    );
  } catch (error) {
    console.error(error);

    message.error(
      "Failed to update status"
    );
  }
};

  // ================= DELETE =================
  const handleDelete = (
    appointmentId: number
  ) => {
    const filtered = data.filter(
      (item) =>
        item.appointmentId !==
        appointmentId
    );

    setData(filtered);

    message.success(
      "Appointment removed"
    );
  };

    const userType =
  localStorage.getItem("userType");
  
  // ================= ACTION MENU =================
const getRowMenuItems = (
  record: AppointmentTable
): MenuProps["items"] => {
  const menuItems: MenuProps["items"] = [
    {
      key: "generate",
      label: record.meetingLink
        ? "Regenerate Meeting"
        : "Generate Meeting",
      icon: <LinkOutlined />,
      onClick: () => {
        generateMeetingLink(record);
      },
    },
    {
      key: "join",
      label: "Join Meeting",
      icon: <VideoCameraOutlined />,
      disabled: !record.meetingLink,
      onClick: () => {
        if (record.meetingLink) {
          window.open(record.meetingLink, "_blank");
        }
      },
    },
    

  ];

  // Show Edit and Delete only for ADMIN
  if (userType === "ADMIN") {
    menuItems.push(
      {
  key: "pay",
  label: "Pay",
  icon: <DollarOutlined />,
  disabled: record.paymentStatus === "Paid",
  onClick: () => {
    createRazorpayOrder(record);
  },
},

{
      key: "payCash",
      label: "Pay Cash",
      icon: <WalletOutlined />, // or MoneyCollectOutlined
      disabled: record.paymentStatus === "Paid",
      onClick: () => {
        handleCashPayment(record);
      },
    },

      {
  key: "paymentLink",
  label: "Generate Payment Link",
  icon: <LinkOutlined />,
  disabled: record.paymentStatus === "Paid",
  onClick: () => {
    generatePaymentLink(record);
  },
},
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: () => {
          navigate("/createappointment", {
            state: record.fullData,
          });
        },
      },
      {
        key: "delete",
        label: "Delete",
        danger: true,
        icon: <DeleteOutlined />,
        onClick: () => {
          handleDelete(record.appointmentId);
        },
      }
    );
  }

  return menuItems;
};

  // ================= TABLE COLUMNS =================
  const columns: ColumnsType<AppointmentTable> =
    [
      {
        title: "Appointment ID",

        dataIndex:
          "appointmentId",

        render: (
          appointmentId: number
        ) => (
          <span className="appointment-id">
            APP-{appointmentId}
          </span>
        ),
      },

      {
  title: "Doctor Name",
  dataIndex: "doctorName",
  key: "doctorName",
},

{
  title: "Patient Name",
  dataIndex: "patientName",
  key: "patientName",
},
      {
        title: "Date",

        dataIndex: "date",
      },

      // ================= KEEP JOIN COLUMN =================

     {
  title: "Meeting",
  dataIndex: "meetingLink",

  render: (meetingLink: string) =>
    meetingLink ? (
      <Space size="middle">

        {/* Join */}
        <Tooltip title="Join Meeting">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <VideoCameraOutlined
              style={{
                fontSize: 18,
                color: "#1677ff",
                cursor: "pointer",
              }}
            />
          </a>
        </Tooltip>

        {/* Copy */}
        <Tooltip title="Copy Link">
          <CopyOutlined
            style={{
              fontSize: 18,
              color: "#722ed1",
              cursor: "pointer",
            }}
            onClick={() => {
              navigator.clipboard.writeText(meetingLink);
              message.success("Meeting link copied!");
            }}
          />
        </Tooltip>

        {/* WhatsApp */}
        <Tooltip title="Share via WhatsApp">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Join Meeting:\n${meetingLink}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppOutlined
              style={{
                fontSize: 18,
                color: "#25D366",
                cursor: "pointer",
              }}
            />
          </a>
        </Tooltip>

      </Space>
    ) : (
      <Tag color="default">No Meeting</Tag>
    ),
},

      {
  title: "Payment Status",
  dataIndex: "paymentStatus",
  key: "paymentStatus",
  width: 150,
  render: (paymentStatus: string) => {
    let color = "default";

    switch (paymentStatus) {
      case "Paid":
        color = "green";
        break;
      case "Pending":
        color = "orange";
        break;
      case "Failed":
        color = "red";
        break;
      case "Refunded":
        color = "purple";
        break;
      default:
        color = "default";
    }

    return <Tag color={color}>{paymentStatus}</Tag>;
  },
},

      {
  title: "Status",

  dataIndex: "status",

  width: 180,

  render: (
    status: string,
    record: AppointmentTable
  ) => (
    <Select
      value={status}
      style={{ width: "100%" }}
      onChange={(value) =>
        updateAppointmentStatus(
          record.appointmentId,
          value
        )
      }
      options={[
        {
          value: "Pending",
          label: (
            <Tag color="orange">
              Pending
            </Tag>
          ),
        },
        {
          value: "Confirmed",
          label: (
            <Tag color="blue">
              Confirmed
            </Tag>
          ),
        },
        {
          value: "Completed",
          label: (
            <Tag color="green">
              Completed
            </Tag>
          ),
        },
        {
          value: "Cancelled",
          label: (
            <Tag color="red">
              Cancelled
            </Tag>
          ),
        },
        {
          value: "Rescheduled",
          label: (
            <Tag color="purple">
              Rescheduled
            </Tag>
          ),
        },
      ]}
    />
  ),
},

      {
        title: "Type",

        dataIndex:
          "appointmentType",
      },

      {
        title: "Fee",

        dataIndex:
          "consultationFee",

        render: (
          consultationFee: number
        ) => (
          <span className="fee-text">
            ₹
            {consultationFee}
          </span>
        ),
      },

      // ================= ACTION COLUMN =================

      {
        title: "Action",

        key: "action",

        width: 100,

        render: (
          _: unknown,
          record: AppointmentTable
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
    <div className="appointment-list-page">

      <DataTable<AppointmentTable>
        title="Appointment List"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="key"
        loading={loading}
        headerActions={
          <Space>
           {userType === "ADMIN" && (
  <AddButton
    label="Add Appointment"
    onClick={() => navigate("/createappointment")}
  />
)}
          </Space>
        }
      />

    </div>
  );
}