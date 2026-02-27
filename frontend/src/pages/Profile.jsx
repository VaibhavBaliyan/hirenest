import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import {
  Upload,
  User,
  Mail,
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  Trash2,
  Briefcase,
} from "lucide-react";
import { Button, Card, Badge } from "../components/ui";

function Profile() {
  const { user, isAuthenticated, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/resumes");
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isJobSeeker) {
      fetchResumes();
    }
  }, [isAuthenticated, isJobSeeker, navigate, fetchResumes]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      await api.post("/api/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Resume uploaded successfully!");
      fetchResumes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleSetActive = async (resumeId) => {
    try {
      await api.patch(`/api/resumes/${resumeId}/activate`);
      toast.success("Active resume updated!");
      fetchResumes();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to set active resume",
      );
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/api/resumes/${resumeId}`);
      toast.success("Resume deleted successfully");
      fetchResumes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete resume");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and resumes</p>
        </div>

        {/* Profile Information */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={24} className="text-primary-600" />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {user?.name}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase size={16} />
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="px-4 py-2 text-sm">
                    <span className="capitalize">{user?.role}</span>
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Member Since
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Resume Management (Job Seekers Only) */}
        {isJobSeeker && (
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText size={24} className="text-primary-600" />
                My Resumes
              </h2>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  variant="primary"
                  size="md"
                  disabled={uploading}
                  leftIcon={<Upload size={16} />}
                  as="span"
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </Button>
              </label>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600">Loading resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12 bg-primary-50 rounded-lg border-2 border-dashed border-primary-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <FileText size={32} className="text-primary-600" />
                </div>
                <p className="text-gray-700 mb-2 font-medium">
                  No resumes uploaded yet
                </p>
                <p className="text-sm text-gray-500">
                  Upload your resume to apply for jobs quickly
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      resume.isActive
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-primary-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText
                            size={20}
                            className={
                              resume.isActive
                                ? "text-green-600"
                                : "text-gray-600"
                            }
                          />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {resume.fileName}
                          </h3>
                          {resume.isActive && (
                            <Badge variant="success">
                              <CheckCircle size={14} className="mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Size: {(resume.fileSize / 1024).toFixed(2)} KB
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded:{" "}
                          {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          as="a"
                          href={resume.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye size={16} />
                          <span className="ml-1">View</span>
                        </Button>
                        {!resume.isActive && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleSetActive(resume._id)}
                            >
                              <CheckCircle size={16} />
                              <span className="ml-1">Set Active</span>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteResume(resume._id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h4 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                💡 Tips:
              </h4>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Upload your resume in PDF format (max 5MB)</li>
                <li>
                  • Set one resume as "Active" to use it for quick applications
                </li>
                <li>• Keep your resume updated with latest experience</li>
                <li>
                  • You can upload multiple versions for different job types
                </li>
              </ul>
            </div>
          </Card>
        )}

        {/* Employer Info */}
        {!isJobSeeker && (
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Employer Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              As an employer, you can post jobs and manage applications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Post Jobs
                </h3>
                <p className="text-sm text-primary-700">
                  Create job postings to find the best talent
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  Manage Applications
                </h3>
                <p className="text-sm text-green-700">
                  Review and manage job applications
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Profile;
