import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Job not found"}
          </p>
          <Link to="/jobs" className="text-blue-600 hover:underline">
            ← Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentJob.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {currentJob.company?.companyName || "Company Name"}
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {currentJob.jobType}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full">
                  📍 {currentJob.location}
                </span>
                {currentJob.salary?.min && currentJob.salary?.max && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                    💰 ₹{currentJob.salary.min.toLocaleString()} - ₹
                    {currentJob.salary.max.toLocaleString()}/month
                  </span>
                )}
              </div>
              <p className="text-gray-500">
                Posted{" "}
                {formatDistanceToNow(new Date(currentJob.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {currentJob.company?.logo && (
              <img
                src={currentJob.company.logo}
                alt={currentJob.company.companyName}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isJobSeeker && (
              <>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-medium text-lg"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSaveToggle}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-md text-2xl transition-transform hover:scale-110"
                  title={isSaved ? "Remove from saved" : "Save job"}
                >
                  {isSaved ? "🔖" : "📑"}
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-medium text-lg text-center"
              >
                Login to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {currentJob.description}
          </p>
        </div>

        {/* Skills Required */}
        {currentJob.skills && currentJob.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentJob.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {currentJob.experience?.min !== undefined && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Required
            </h2>
            <p className="text-gray-700 text-lg">
              {currentJob.experience.min} -{" "}
              {currentJob.experience.max || currentJob.experience.min} years
            </p>
          </div>
        )}

        {/* Company Info */}
        {currentJob.company && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About the Company
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {currentJob.company.companyName}
            </h3>
            {currentJob.company.description && (
              <p className="text-gray-700 mb-4">
                {currentJob.company.description}
              </p>
            )}
            {currentJob.company.website && (
              <a
                href={currentJob.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Website →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Apply for {currentJob.title}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us why you're a great fit for this role..."
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
