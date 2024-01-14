import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import ResponsiveAppBar from "./Navbar";

const pages_manager = [
  { title: "Dashboard", route: "/admin" },
  { title: "Users", route: "/users" },
  { title: "Bikes", route: "/bikes" },
];
const pages_user = [
  { title: "Dashboard", route: "/user" },
  { title: "Reserve a bike", route: "/reservation" },
];
const ProtectedRoute = (props: any) => {
  const currentRole = localStorage.getItem("role");
  const { children, role } = props;
  const { user } = useUserAuth();
  if (!user || currentRole !== role) {
    localStorage.clear();
    return <Navigate to="/" />;
  }
  return (
    <>
      <ResponsiveAppBar
        pages={role === "manager" ? pages_manager : pages_user}
      />
      {children}
    </>
  );
};

export default ProtectedRoute;
