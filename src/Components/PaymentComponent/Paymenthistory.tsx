import { useEffect, useState } from "react";

import {
  Avatar,
  Tag,
  message,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import "./PaymentHistory.css";
import api from "../../api/axios";
import DataTable from "../../Utils/DataTable";

interface PaymentApiResponse {
  verificationId: number;
  companyId: number;
  patientId: number;
  patientName: string;
  appointmentId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  capturedAt: string;
}

interface PaymentTable {
  key: number;
  verificationId: number;
  patientName: string;
  appointmentId: number;
  amount: number;
  status: string;
  capturedAt: string;
}

export default function PaymentHistory() {
  const [data, setData] = useState<PaymentTable[]>([]);
  const [loading, setLoading] = useState(false);

  const admin = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  const companyId = admin.companyId;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/Paymenthistory/company/${companyId}`
      );

      const formattedData = response.data.map(
        (item: PaymentApiResponse) => ({
          key: item.verificationId,

          verificationId:
            item.verificationId,

          patientName:
            item.patientName,

          appointmentId:
            item.appointmentId,

          amount: item.amount,

          status: item.status,

          capturedAt:
            item.capturedAt,
        })
      );

      setData(formattedData);
    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load payment history."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<PaymentTable> = [
    {
      title: "Patient",
      dataIndex: "patientName",
      render: (
        patientName: string
      ) => (
        <div className="payment-user">
          <Avatar
            size={42}
            icon={<UserOutlined />}
          />

          <div>
            <h4>{patientName}</h4>
          </div>
        </div>
      ),
    },

    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: number) => (
        <>₹{amount}</>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "CAPTURED"
              ? "green"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Captured At",
      dataIndex: "capturedAt",
      render: (date: string) =>
        new Date(date).toLocaleString(),
    },
  ];

  return (
    <div className="payment-page">
      <DataTable<PaymentTable>
        title="Payment History"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="key"
        loading={loading}
      />
    </div>
  );
}