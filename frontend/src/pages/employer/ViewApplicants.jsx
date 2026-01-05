import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

function ViewApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/applications/jobs/${jobId}/applicants`
      );
      setApplicants(response.data);

      // Fetch job details
      const jobResponse = await api.get(`/api/jobs/${jobId}`);
      setJob(jobResponse.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applicants"
      );
      navigate("/employer/jobs");
    } finally {
      setLoading(false);
    }
  }, [jobId, navigate]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      await api.patch(`/api/applications/${applicationId}/status`, {
        status: newStatus,
      });
      toast.success(`Application ${newStatus} successfully!`);

      // Update local state
      setApplicants(
        applicants.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedApplicants.length === 0) {
      toast.error("Please select at least one applicant");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${selectedApplicants.length} applicant(s)?`
      )
    ) {
      return;
    }

    try {
      setUpdatingStatus("bulk");
      await Promise.all(
        selectedApplicants.map((id) =>
          api.patch(`/api/applications/${id}/status`, { status: action })
        )
      );
      toast.success(
        `${selectedApplicants.length} applicant(s) ${action} successfully!`
      );
      setSelectedApplicants([]);
      fetchApplicants();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update applicants"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleSelectApplicant = (id) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplicants.map((app) => app._id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/employer/jobs")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to My Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{job?.title}</h1>
          <p className="text-gray-600 mt-1">
            {applicants.length}{" "}
            {applicants.length === 1 ? "Applicant" : "Applicants"}
          </p>
        </div>

        {/* Filter Tabs */}
        {applicants.length > 0 && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All ({applicants.length})
            </button>
            <button
              onClick={() => setFilterStatus("applied")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "applied"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Applied ({applicants.filter((a) => a.status === "applied").length}
              )
            </button>
            <button
              onClick={() => setFilterStatus("shortlisted")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "shortlisted"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Shortlisted (
              {applicants.filter((a) => a.status === "shortlisted").length})
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filterStatus === "rejected"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Rejected (
              {applicants.filter((a) => a.status === "rejected").length})
            </button>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedApplicants.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4 flex justify-between items-center">
            <span className="text-blue-900 font-medium">
              {selectedApplicants.length} applicant(s) selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => handleBulkAction("shortlisted")}
                disabled={updatingStatus === "bulk"}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium text-sm disabled:opacity-50"
              >
                Shortlist Selected
              </button>
              <button
                onClick={() => handleBulkAction("rejected")}
                disabled={updatingStatus === "bulk"}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm disabled:opacity-50"
              >
                Reject Selected
              </button>
            </div>
          </div>
        )}

        {/* Select All Checkbox */}
        {filteredApplicants.length > 0 && (
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  selectedApplicants.length === filteredApplicants.length &&
                  filteredApplicants.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
        )}

        {/* Applicants List */}
        {filteredApplicants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {filterStatus === "all"
                ? "No Applications Yet"
                : `No ${filterStatus} Applicants`}
            </h2>
            <p className="text-gray-600">
              {filterStatus === "all"
                ? "Applications will appear here once job seekers apply to this position"
                : `You don't have any ${filterStatus} applicants at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(application._id)}
                    onChange={() => toggleSelectApplicant(application._id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.applicantId?.name || "Anonymous"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          📧 {application.applicantId?.email || "No email"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.appliedAt),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>

                      {/* Resume Link */}
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-sm"
                        >
                          📄 View Resume
                        </a>
                      )}
                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Cover Letter:
                        </h4>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {application.status !== "shortlisted" && (
                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              application._id,
                              "shortlisted"
                            )
                          }
                          disabled={updatingStatus === application._id}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium text-sm disabled:opacity-50"
                        >
                          {updatingStatus === application._id
                            ? "Updating..."
                            : "Shortlist"}
                        </button>
                      )}
                      {application.status !== "rejected" && (
                        <button
                          onClick={() =>
                            updateApplicationStatus(application._id, "rejected")
                          }
                          disabled={updatingStatus === application._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm disabled:opacity-50"
                        >
                          {updatingStatus === application._id
                            ? "Updating..."
                            : "Reject"}
                        </button>
                      )}
                      {application.status === "rejected" && (
                        <button
                          onClick={() =>
                            updateApplicationStatus(application._id, "applied")
                          }
                          disabled={updatingStatus === application._id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm disabled:opacity-50"
                        >
                          {updatingStatus === application._id
                            ? "Updating..."
                            : "Revert to Applied"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplicants;
