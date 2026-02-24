import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AllTask from "./pages/tasks/AllTask.jsx";
import EditTask from "./pages/tasks/EditTask.jsx";
import NewTask from "./pages/tasks/NewTask.jsx";
import DeleteTask from "./pages/tasks/DeleteTask.jsx";
import MyTask from "./pages/tasks/MyTask.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NewUser from "./pages/NewUser.jsx";
import NewPlacement from "./pages/placement/NewPlacement.jsx";
import AllPlacement from "./pages/placement/AllPlacement.jsx";
import EditPlacement from "./pages/placement/EditPlacement.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* All Routes */}
        <Route
          path="/task/all"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <AllTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task/my"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <MyTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task/edit"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <EditTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task/new"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <NewTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement/new"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <NewPlacement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement/all"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <AllPlacement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement/edit"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <EditPlacement />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}

        <Route
          path="/task/delete"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DeleteTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/newUser"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <NewUser />
            </ProtectedRoute>
          }
        />

        {/* Default Route - Redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
