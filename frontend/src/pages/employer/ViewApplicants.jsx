import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Users, Mail, FileText } from "lucide-react";
import { Button, Badge, Card } from "../../components/ui";

const TAB_BASE = "px-4 py-2 rounded-md font-medium text-sm transition-colors";
const TAB_ACTIVE = TAB_BASE + " bg-primary-600 text-white";
const TAB_INACTIVE = TAB_BASE + " bg-white text-gray-700 hover:bg-gray-100";

function getStatusBadgeVariant(status) {
  switch (status) {
    case "shortlisted":
      return "primary";
    case "rejected":
      return "danger";
    default:
      return "secondary";
  }
}

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
        `/api/applications/jobs/${jobId}/applicants`,
      );
      setApplicants(response.data);
      const jobResponse = await api.get(`/api/jobs/${jobId}`);
      setJob(jobResponse.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applicants",
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
      setApplicants(
        applicants.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
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
        `Are you sure you want to ${action} ${selectedApplicants.length} applicant(s)?`,
      )
    ) {
      return;
    }
    try {
      setUpdatingStatus("bulk");
      await Promise.all(
        selectedApplicants.map((id) =>
          api.patch(`/api/applications/${id}/status`, { status: action }),
        ),
      );
      toast.success(
        `${selectedApplicants.length} applicant(s) ${action} successfully!`,
      );
      setSelectedApplicants([]);
      fetchApplicants();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update applicants",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleSelectApplicant = (id) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplicants.map((app) => app._id));
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/employer/jobs")}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <ChevronLeft size={18} />
            Back to My Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{job?.title}</h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <Users size={18} />
            {applicants.length}{" "}
            {applicants.length === 1 ? "Applicant" : "Applicants"}
          </p>
        </div>

        {/* Filter Tabs */}
        {applicants.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? TAB_ACTIVE : TAB_INACTIVE}
            >
              All ({applicants.length})
            </button>
            <button
              onClick={() => setFilterStatus("applied")}
              className={filterStatus === "applied" ? TAB_ACTIVE : TAB_INACTIVE}
            >
              Applied ({applicants.filter((a) => a.status === "applied").length}
              )
            </button>
            <button
              onClick={() => setFilterStatus("shortlisted")}
              className={
                filterStatus === "shortlisted" ? TAB_ACTIVE : TAB_INACTIVE
              }
            >
              Shortlisted (
              {applicants.filter((a) => a.status === "shortlisted").length})
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              className={
                filterStatus === "rejected" ? TAB_ACTIVE : TAB_INACTIVE
              }
            >
              Rejected (
              {applicants.filter((a) => a.status === "rejected").length})
            </button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedApplicants.length > 0 && (
          <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4 flex justify-between items-center">
            <span className="text-primary-900 font-medium">
              {selectedApplicants.length} applicant(s) selected
            </span>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                disabled={updatingStatus === "bulk"}
                onClick={() => handleBulkAction("shortlisted")}
              >
                Shortlist Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={updatingStatus === "bulk"}
                onClick={() => handleBulkAction("rejected")}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Reject Selected
              </Button>
            </div>
          </div>
        )}

        {/* Select All */}
        {filteredApplicants.length > 0 && (
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={
                  selectedApplicants.length === filteredApplicants.length &&
                  filteredApplicants.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
        )}

        {/* Applicants List */}
        {filteredApplicants.length === 0 ? (
          <Card padding="lg">
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="text-primary-600" size={40} />
              </div>
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
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((application) => (
              <Card key={application._id} padding="lg">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(application._id)}
                    onChange={() => toggleSelectApplicant(application._id)}
                    className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.applicantId?.name || "Anonymous"}
                          </h3>
                          <Badge
                            variant={getStatusBadgeVariant(application.status)}
                          >
                            {application.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                          <Mail size={14} />
                          {application.applicantId?.email || "No email"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.appliedAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </p>
                      </div>

                      {/* Resume Link */}
                      {application.resumeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<FileText size={15} />}
                          onClick={() =>
                            window.open(application.resumeUrl, "_blank")
                          }
                        >
                          View Resume
                        </Button>
                      )}
                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-md border-l-4 border-primary-400">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Cover Letter
                        </h4>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {application.status !== "shortlisted" && (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={updatingStatus === application._id}
                          onClick={() =>
                            updateApplicationStatus(
                              application._id,
                              "shortlisted",
                            )
                          }
                        >
                          {updatingStatus === application._id
                            ? "Updating..."
                            : "Shortlist"}
                        </Button>
                      )}
                      {application.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingStatus === application._id}
                          onClick={() =>
                            updateApplicationStatus(application._id, "rejected")
                          }
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          {updatingStatus === application._id
                            ? "Updating..."
                            : "Reject"}
                        </Button>
                      )}
                      {application.status === "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingStatus === application._id}
                          onClick={() =>
                            updateApplicationStatus(application._id, "applied")
                          }
                        >
                          {updatingStatus === application._id
                            ? "Updating..."
                            : "Revert to Applied"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplicants;
