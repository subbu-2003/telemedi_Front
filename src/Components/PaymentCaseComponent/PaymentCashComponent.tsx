import { useEffect, useState } from "react";

import {
  Avatar,
  Tag,
  message,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import "./PaymentCashComponent.css";

import api from "../../api/axios";

import DataTable from "../../Utils/DataTable";

interface PaymentCashApiResponse {
  cashId: number;
  companyId: number;
  patientId: number;
  patientName:string;
  appointmentId: number;
  amount: number;
  currency: string;
  status: string;
  capturedAt: string;
  createdAt: string;
}

interface PaymentCashTable {
  key: number;
  cashId: number;
  patientName: string;
  appointmentId: number;
  amount: number;
  currency: string;
  status: string;
  capturedAt: string;
}

export default function PaymentCashComponent() {
  const [data, setData] = useState<
    PaymentCashTable[]
  >([]);

  const [loading, setLoading] =
    useState(false);

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
        `/Paymentcash/company/${companyId}`
      );

      const formattedData = (
        Array.isArray(response.data)
          ? response.data
          : []
      ).map(
        (
          item: PaymentCashApiResponse
        ) => ({
          key: item.cashId,

          cashId: item.cashId,

          patientId:
            item.patientId,

        patientName: item.patientName,

          appointmentId:
            item.appointmentId,

          amount: item.amount,

          currency:
            item.currency,

          status: item.status,

          capturedAt:
            item.capturedAt,
        })
      );

      setData(formattedData);
    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load cash payment history."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<PaymentCashTable> =
    [
      {
        title: "Patient",
        dataIndex: "patientName",

        render: (
          patientId: number
        ) => (
          <div className="payment-user">
            <Avatar
              size={42}
              icon={
                <UserOutlined />
              }
            />

            <div>
              <h4>
                {patientId}
              </h4>
            </div>
          </div>
        ),
      },

      {
        title: "Appointment ID",
        dataIndex:
          "appointmentId",
      },

      {
        title: "Amount",
        dataIndex: "amount",

        render: (
          amount: number
        ) => (
          <>
            ₹
            {amount.toLocaleString(
              "en-IN"
            )}
          </>
        ),
      },

      {
        title: "Currency",
        dataIndex: "currency",

        render: (
          currency: string
        ) => (
          <Tag color="blue">
            {currency}
          </Tag>
        ),
      },

      {
        title: "Status",
        dataIndex: "status",

        render: (
          status: string
        ) => (
          <Tag
            color={
              status ===
              "CAPTURED"
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
        dataIndex:
          "capturedAt",

        render: (
          date: string
        ) =>
          new Date(
            date
          ).toLocaleString(),
      },
    ];

  return (
    <div className="payment-page">
      <DataTable<PaymentCashTable>
        title="Cash Payment History"
        count={data.length}
        columns={columns}
        data={data}
        rowKey="key"
        loading={loading}
      />
    </div>
  );
}