import { Routes, Route } from "react-router-dom";

import Home from "../Pages/Home/Home.jsx";
import Login from "../Pages/auth/Login.jsx";
import Register from "../Pages/auth/Register.jsx";
import AuthorAddPaper from "../Pages/AuthorPages/AuthorDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import AuthorDashboard from "../Pages/AuthorPages/AuthorDashboard.jsx";
import OrganizerDashboard from "../Pages/OrganizerPages/OrganizerDashboard.jsx";
import ReviewerDashboard from "../Pages/ReviewerPages/ReviewerDashboard.jsx";
import AddReview from "../Pages/ReviewerPages/AddReview.jsx";
import ForgotPassword from "../Pages/auth/ForgotPassword.jsx";
import ResetPassword from "../Pages/auth/ResetPassword.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/author/addPaper"
        element={
          <ProtectedRoute>
            <RoleRoute role="author">
              <AuthorAddPaper />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/author"
        element={
          <ProtectedRoute>
            <RoleRoute role="author">
              <AuthorDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer"
        element={
          <ProtectedRoute>
            <RoleRoute role="organizer">
              <OrganizerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviewer"
        element={
          <ProtectedRoute>
            <RoleRoute role="reviewer">
              <ReviewerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviewer/add/:id"
        element={
          <ProtectedRoute>
            <RoleRoute role="reviewer">
              <AddReview />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
