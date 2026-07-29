import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const userType =
    localStorage.getItem("userType");

  if (
    userType !== "ADMIN" &&
    userType !== "DOCTOR"
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}