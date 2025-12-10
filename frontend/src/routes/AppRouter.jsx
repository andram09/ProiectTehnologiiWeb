import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AddPaper from "../pages/AuthorPages/AddPaper.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import AuthorDashboard from "../pages/AuthorPages/AuthorDashboard.jsx";
import OrganizerDashboard from "../pages/OrganizerPages/OrganizerDashboard.jsx";
import ReviewerDashboard from "../pages/ReviewerPages/ReviewerDashboard.jsx";
import AddReview from "../pages/ReviewerPages/AddReview.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import PersonalPage from "../pages/PersonalPage/PersonalPage.jsx";
import Conferences from "../pages/Conferences/Conferences.jsx";
import EditPaper from "../pages/AuthorPages/EditPaper.jsx";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/author/editpaper/:id" element={<EditPaper />} />

      <Route
        path="/author/profile"
        element={
          <ProtectedRoute>
            <RoleRoute role="author">
              <PersonalPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/profile"
        element={
          <ProtectedRoute>
            <RoleRoute role="organizer">
              <PersonalPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviewer/profile"
        element={
          <ProtectedRoute>
            <RoleRoute role="reviewer">
              <PersonalPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/author/addPaper"
        element={
          <ProtectedRoute>
            <RoleRoute role="author">
              <AddPaper />
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
      <Route
        path="/author/conferences"
        element={
          <ProtectedRoute>
            <RoleRoute role="author">
              <Conferences />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/conferences"
        element={
          <ProtectedRoute>
            <RoleRoute role="organizer">
              <Conferences />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviewer/conferences"
        element={
          <ProtectedRoute>
            <RoleRoute role="reviewer">
              <Conferences />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
