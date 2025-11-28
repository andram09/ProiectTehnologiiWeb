import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AuthorAddPaper from "../pages/AuthorPages/AddPaper.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx"
import AuthorDashboard from "../pages/AuthorPages/AuthorDashboard.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/author/addPaper"
        element={
          <ProtectedRoute>
            <RoleRoute role="author">
              <AuthorAddPaper/>
              </RoleRoute>
          </ProtectedRoute>
        }
      /> 
      <Route
      path="/author"
      element={
        <ProtectedRoute>
          <RoleRoute role="author">
          <AuthorDashboard/>
          </RoleRoute>
        </ProtectedRoute>
      }
      />
    </Routes>
  );
}
