import { Routes, Route } from "react-router-dom";

import AuthGuard from "./Auth/AuthGuard";

import Layout from "./Components/LayoutComponent/Layout";

import Login from "./Components/LoginComponent/Login";

import Dashboard from "./Components/DashboardComponent/Dashboard";

import Employee from "./Components/EmployeeComponent/Employee";

import Profile from "./Components/ProfileComponent/Profile";

import Department from "./Components/DepartmentComponent/Department";

import Designation from "./Components/DesignationComponent/Designation";

import AttendancePermission from "./Components/AttendancePermission/AttendancePermission";

import ManageBranch from "./Components/ManageBranchComponent/ManageBranch";

import Camera from "./Components/CameraComponent/Camera";

import ListPatient from "./Components/Patient/ListpatientComponent/Listpatient";

import CreatePatient from "./Components/Patient/CreatepatientComponent/Createpatient";

import CreatePrescription from "./Components/Prescription/CreatePrescriptionComponent/Createprescription";

import ListPrescription from "./Components/Prescription/ListPrescriptionComponent/Listprescription";

import Meeting from "./Components/MeetingComponent/Meeting";

import VideoStream from "./Components/VideoStreamComponent/VideoStream";

import Doctorcreate from "./Components/Doctor/DoctorCreateComponent/Doctorcreate";

import Doctorlist from "./Components/Doctor/DoctorListComponent/Doctorlist";

import Createappointment from "./Components/Appointment/CreateAppointmentComponent/Createappointment";

import Listappointment from "./Components/Appointment/ListAppointmentComponent/Listappointment";
import Paymenthistory from "./Components/PaymentComponent/Paymenthistory";
import TermsandConditions from "./Components/TermsComponent/TermsandConditions";

export default function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

          <Route
          path="videostream"
          element={
            <VideoStream />
          }
        />

          <Route
          path="terms"
          element={
            <TermsandConditions />
          }
        />


    

      {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >

        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="employee"
          element={<Employee />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="department"
          element={<Department />}
        />

        <Route
          path="designation"
          element={<Designation />}
        />

        <Route
          path="patientlist"
          element={<ListPatient />}
        />

        <Route
          path="createpatient"
          element={<CreatePatient />}
        />

        <Route
          path="createdoctor"
          element={<Doctorcreate />}
        />

        <Route
          path="doctorlist"
          element={<Doctorlist />}
        />

        <Route
          path="createappointment"
          element={<Createappointment />}
        />

        <Route
          path="listappointment"
          element={<Listappointment />}
        />

        <Route
          path="createprescription"
          element={
            <CreatePrescription />
          }
        />

        <Route
          path="listprescription"
          element={
            <ListPrescription />
          }
        />

            <Route
          path="payment"
          element={
            <Paymenthistory />
          }
        />
        

        <Route
          path="meeting"
          element={<Meeting />}
        />

    

        <Route
          path="camera"
          element={<Camera />}
        />

        <Route
          path="attendancepermission"
          element={
            <AttendancePermission />
          }
        />

        <Route
          path="managebranch"
          element={<ManageBranch />}
        />

      </Route>

    </Routes>
  );
}