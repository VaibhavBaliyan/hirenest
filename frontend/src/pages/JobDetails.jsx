import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchJobById, clearCurrentJob } from "../redux/slices/jobSlice";
import {
  saveJob,
  unsaveJob,
  fetchSavedJobs,
} from "../redux/slices/savedJobSlice";
import { useAuth } from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import api from "../utils/axios";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Bookmark,
  Briefcase,
  Clock,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";
import { Card, Badge, Chip, Button, Spinner, Input } from "../components/ui";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJob, loading, error } = useSelector((state) => state.jobs);
  const { savedJobIds } = useSelector((state) => state.savedJobs);
  const { isAuthenticated, isJobSeeker } = useAuth();
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const isSaved = savedJobIds.includes(id);

  useEffect(() => {
    dispatch(fetchJobById(id));
    if (isAuthenticated && isJobSeeker) {
      dispatch(fetchSavedJobs());
    }
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, id, isAuthenticated, isJobSeeker]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    if (!isJobSeeker) {
      toast.error("Only job seekers can save jobs");
      return;
    }

    try {
      if (isSaved) {
        await dispatch(unsaveJob(id)).unwrap();
        toast.success("Job removed from saved list");
      } else {
        await dispatch(saveJob(id)).unwrap();
        toast.success("Job saved successfully!");
      }
    } catch (error) {
      toast.error(error || "Failed to update saved status");
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    if (!isJobSeeker) {
      toast.error("Only job seekers can apply");
      return;
    }

    try {
      setApplying(true);
      await api.post(`/api/applications/jobs/${id}/apply`, { coverLetter });
      toast.success("Application submitted successfully!");
      setShowApplyModal(false);
      setCoverLetter("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" variant="primary" />
          <p className="mt-4 text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !currentJob) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card padding="xl" className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The job you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            variant="primary"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/jobs")}
          >
            Back to Jobs
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/jobs")}
          >
            Back to Jobs
          </Button>
        </div>

        {/* Job Header Card */}
        <Card padding="xl" className="mb-6">
          <div className="flex gap-6">
            {/* Company Logo */}
            <div className="shrink-0">
              {currentJob.company?.logo ? (
                <img
                  src={currentJob.company.logo}
                  alt={currentJob.company.companyName}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-primary-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary-100 border-2 border-primary-200 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-primary-500" />
                </div>
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentJob.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {currentJob.company?.companyName || "Company Name"}
              </p>

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="purple" size="lg">
                  {currentJob.jobType}
                </Badge>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
                  <MapPin size={16} />
                  <span>{currentJob.location}</span>
                </div>

                {currentJob.salary?.min && currentJob.salary?.max && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full font-semibold">
                    <IndianRupee size={16} />
                    <span>
                      ₹{currentJob.salary.min.toLocaleString()} - ₹
                      {currentJob.salary.max.toLocaleString()}/month
                    </span>
                  </div>
                )}
              </div>

              {/* Posted Date */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock size={14} />
                <span>
                  Posted{" "}
                  {formatDistanceToNow(new Date(currentJob.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {/* Job Description */}
            <Card padding="xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentJob.description}
              </p>
            </Card>

            {/* Skills Required */}
            {currentJob.skills && currentJob.skills.length > 0 && (
              <Card padding="xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      className="bg-primary-50 text-primary-700 border-primary-200"
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              </Card>
            )}

            {/* Experience Required */}
            {currentJob.experience?.min !== undefined && (
              <Card padding="xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Experience Required
                </h2>
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="text-primary-500" size={20} />
                  <span className="text-lg">
                    {currentJob.experience.min} -{" "}
                    {currentJob.experience.max || currentJob.experience.min}{" "}
                    years
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1 min-w-0">
            <div className="sticky top-6 space-y-4">
              {/* Company Card */}
              {currentJob.company && (
                <Card
                  padding="lg"
                  className="bg-linear-to-br from-primary-50 to-white border-primary-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    About Company
                  </h3>

                  {currentJob.company.logo && (
                    <img
                      src={currentJob.company.logo}
                      alt={currentJob.company.companyName}
                      className="w-16 h-16 rounded-lg object-cover mb-3 border border-primary-100"
                    />
                  )}

                  <h4 className="font-semibold text-gray-900 mb-2">
                    {currentJob.company.companyName}
                  </h4>

                  {currentJob.company.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {currentJob.company.description}
                    </p>
                  )}

                  {currentJob.company.website && (
                    <a
                      href={currentJob.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      Visit Website
                      <ExternalLink size={14} />
                    </a>
                  )}
                </Card>
              )}

              {/* Apply Button */}
              {isJobSeeker && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowApplyModal(true)}
                >
                  Apply Now
                </Button>
              )}

              {!isAuthenticated && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Login to Apply
                </Button>
              )}

              {/* Save Button */}
              {isJobSeeker && (
                <Button
                  variant={isSaved ? "secondary" : "outline"}
                  size="lg"
                  className="w-full"
                  leftIcon={
                    <Bookmark
                      size={18}
                      className={isSaved ? "fill-current" : ""}
                    />
                  }
                  onClick={handleSaveToggle}
                >
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
              )}

              {/* Job Details Metadata Card */}
              <Card padding="md" className="bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Job Details
                </h4>

                <div className="space-y-2 text-sm">
                  {currentJob.experience?.min !== undefined && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {currentJob.experience.min}-
                        {currentJob.experience.max || currentJob.experience.min}{" "}
                        years experience
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-600">{currentJob.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-600">
                      Posted{" "}
                      {formatDistanceToNow(new Date(currentJob.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full shadow-2xl"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply for {currentJob.title}
                </h2>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleApply}
                loading={applying}
              >
                Submit Application
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
