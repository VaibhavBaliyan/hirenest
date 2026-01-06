import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import EmployerDashboard from "./pages/employer/Dashboard";
import CreateCompany from "./pages/employer/CreateCompany";
import CompanyProfile from "./pages/employer/CompanyProfile";
import CreateJob from "./pages/employer/CreateJob";
import MyJobs from "./pages/employer/MyJobs";
import ViewApplicants from "./pages/employer/ViewApplicants";
import EditJob from "./pages/employer/EditJob";

// Protected Route Component
const ProtectedRoute = ({
  children,
  employerOnly = false,
  jobSeekerOnly = false,
}) => {
  const { isAuthenticated, isEmployer, isJobSeeker } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (employerOnly && !isEmployer) {
    return <Navigate to="/" replace />;
  }

  if (jobSeekerOnly && !isJobSeeker) {
    return <Navigate to="/" replace />;
  }

  return children;
};

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSavedJobs } from "./redux/slices/savedJobSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isJobSeeker } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isJobSeeker) {
      dispatch(fetchSavedJobs());
    }
  }, [isAuthenticated, isJobSeeker, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Protected Routes - We'll add more later */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute jobSeekerOnly={true}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute jobSeekerOnly={true}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Employer Routes */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute employerOnly={true}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/setup-company"
          element={
            <ProtectedRoute employerOnly={true}>
              <CreateCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/company"
          element={
            <ProtectedRoute employerOnly={true}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/create"
          element={
            <ProtectedRoute employerOnly={true}>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute employerOnly={true}>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:jobId/applicants"
          element={
            <ProtectedRoute employerOnly={true}>
              <ViewApplicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:jobId/edit"
          element={
            <ProtectedRoute employerOnly={true}>
              <EditJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
