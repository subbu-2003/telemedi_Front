import {
  useEffect,
  useState,
} from "react";

import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Avatar,
  Typography,
  Spin,
  message,
} from "antd";

import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import api from "../../api/axios"


import "./Dashboard.css";

const { Text } = Typography;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface RecentPatient {
  patientId: number;
  patientName: string;
  phone: string;
  registrationDate: string;
}

interface Doctor {
  doctorId: number;
  name: string;
  department: string;
  status: string;
}

interface Appointment {
  appointmentId: number;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
  appointmentType: string;
}

interface ChartData {
  day: string;
  count: number;
}

interface DashboardResponse {
  totalDoctors: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalAppointments: number;

  recentPatients: RecentPatient[];

  doctors: Doctor[];

  todayAppointments: Appointment[];

  patientCountPerDays: ChartData[];

  completedAppointmentPerDays: ChartData[];
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function Dashboard() {
  const [loading, setLoading] =
    useState(false);

  const [dashboardData, setDashboardData] =
    useState<DashboardResponse | null>(
      null
    );

  // ─────────────────────────────────────────────
  // GET DASHBOARD DATA
  // ─────────────────────────────────────────────

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response =
        await api.get(
          "/AdminDashboard/company/1"
        );

      setDashboardData(response.data);

    } catch (error) {
      console.log(error);

      message.error(
        "Failed to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // TABLES
  // ─────────────────────────────────────────────

  const patientColumns = [
    {
      title: "Patient",
      dataIndex: "patientName",

      render: (
        patientName: string
      ) => (
        <div className="patient-info">
          <Avatar
            size={40}
            icon={<UserOutlined />}
          />

          <div>
            <h4>{patientName}</h4>
          </div>
        </div>
      ),
    },

    {
      title: "Phone",
      dataIndex: "phone",

      render: (phone: string) => (
        <div className="phone-text">
          <PhoneOutlined />

          <span>{phone}</span>
        </div>
      ),
    },

    {
      title: "Registered",
      dataIndex: "registrationDate",

      render: (date: string) => (
        <span className="date-text">
          {new Date(
            date
          ).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const appointmentColumns = [
    {
      title: "Patient",
      dataIndex: "patientName",
    },

    {
      title: "Doctor",
      dataIndex: "doctorName",
    },

    {
      title: "Type",
      dataIndex: "appointmentType",

      render: (type: string) => (
        <Tag color="blue">
          {type}
        </Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",

      render: (status: string) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Date",
      dataIndex: "date",

      render: (date: string) => (
        <span className="date-text">
          {new Date(
            date
          ).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="dashboard-loader">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>
            Hospital Dashboard
          </h1>

          <p>
            Welcome back! Here
            is your hospital
            overview.
          </p>
        </div>

    
      </div>

      {/* STATISTICS */}

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card stats-card patients-card">
            <Statistic
              title="Total Patients"
              value={
                dashboardData?.totalPatients ||
                0
              }
              prefix={
                <UserOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card stats-card doctors-card">
            <Statistic
              title="Doctors"
              value={
                dashboardData?.totalDoctors ||
                0
              }
              prefix={
                <TeamOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card stats-card prescription-card">
            <Statistic
              title="Prescriptions"
              value={
                dashboardData?.totalPrescriptions ||
                0
              }
              prefix={
                <FileTextOutlined />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card stats-card appointment-card">
            <Statistic
              title="Appointments"
              value={
                dashboardData?.totalAppointments ||
                0
              }
              prefix={
                <CalendarOutlined />
              }
            />
          </Card>
        </Col>
      </Row>

      {/* CHARTS */}

      {/* <Row
        gutter={[20, 20]}
        className="chart-section"
      >
        

        <Col xs={24} lg={12}>
          <Card
            title="Patients Per Day"
            className="dashboard-card"
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={
                  dashboardData?.patientCountPerDays ||
                  []
                }
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="count"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

   

        <Col xs={24} lg={12}>
          <Card
            title="Completed Appointments"
            className="dashboard-card"
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={
                  dashboardData?.completedAppointmentPerDays ||
                  []
                }
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="day"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="count"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row> */}

      {/* TABLES */}

      <Row
        gutter={[20, 20]}
        className="table-section"
      >
        {/* RECENT PATIENTS */}

        <Col xs={24} lg={12}>
          <Card
            title="Recent Patients"
            className="dashboard-card"
          >
            <Table
              columns={
                patientColumns
              }
              dataSource={
                dashboardData?.recentPatients ||
                []
              }

              
              rowKey="patientId"
              pagination={false}
              className="common-table"
            />
          </Card>
        </Col>

        {/* TODAY APPOINTMENTS */}

        <Col xs={24} lg={12}>
          <Card
            title="Today's Appointments"
            className="dashboard-card"
          >
            <Table
              columns={
                appointmentColumns
              }
              dataSource={
                dashboardData?.todayAppointments ||
                []
              }
              rowKey="appointmentId"
              pagination={false}
              className="common-table"
            />
          </Card>
        </Col>
      </Row>

      {/* DOCTORS */}

      <Card
        title="Doctors"
        className="dashboard-card doctors-table-card"
      >
        <Row gutter={[16, 16]}>
          {dashboardData?.doctors.map(
            (doctor) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={
                  doctor.doctorId
                }
              >
                <div className="doctor-card">
                  <Avatar
                    size={60}
                    icon={
                      <UserOutlined />
                    }
                  />

                  <h3>
                    {doctor.name}
                  </h3>

                  <Text>
                    {
                      doctor.department
                    }
                  </Text>

                  <Tag
                    color="green"
                    className="doctor-status"
                  >
                    {
                      doctor.status
                    }
                  </Tag>
                </div>
              </Col>
            )
          )}
        </Row>
      </Card>
    </div>
  );
}