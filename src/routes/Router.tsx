import { createBrowserRouter, Navigate } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Login from "../pages/Login";
import Skills from "../pages/Skills";
import ProtectedRoute from "./ProtectedRoute";
import ContactView from "../pages/ContactView";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "skills",
        element: <Skills />,
      },
      {
        path: "contacts",
        element: <ContactView />,
      },
    ],
  },
]);
