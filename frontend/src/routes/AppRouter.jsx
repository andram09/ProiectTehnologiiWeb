import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AuthorAddPaper from "../pages/AuthorPages/AddPaper.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import AuthorDashboard from "../pages/AuthorPages/AuthorDashboard.jsx";
import OrganizerDashBoard from "../pages/OrganizerPages/OrganizerDashboard.jsx";
import ReviewerDashboard from "../pages/ReviewerPages/ReviewerDashboard.jsx";
import AddReview from "../pages/ReviewerPages/AddReview.jsx";

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
              <OrganizerDashBoard />
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
