import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user, role);
  if (!user || user.role !== role.toUpperCase()) {
    return <Navigate to="/" />;
  }
  return children;
}
