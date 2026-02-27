import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, setFilters } from "../redux/slices/jobSlice";
import { Search, MapPin, Briefcase, X } from "lucide-react";
import JobCard from "../components/jobs/JobCard";
import { Input, Button, Chip } from "../components/ui";

function Jobs() {
  const dispatch = useDispatch();
  const { jobs, filters, pagination, loading, error } = useSelector(
    (state) => state.jobs,
  );

  const [localFilters, setLocalFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
  });

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ ...localFilters, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFilter = (filterName) => {
    const newFilters = { ...localFilters, [filterName]: "" };
    setLocalFilters(newFilters);
    dispatch(setFilters({ ...newFilters, page: 1 }));
  };

  const handleClearAll = () => {
    const clearedFilters = { keyword: "", location: "", jobType: "" };
    setLocalFilters(clearedFilters);
    dispatch(setFilters({ ...clearedFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ ...filters, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get active filters for display (exclude internal pagination params)
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value && key !== "page" && key !== "limit")
    .map(([key, value]) => ({
      key,
      value,
      label:
        key === "keyword"
          ? "Search"
          : key === "jobType"
            ? "Job Type"
            : "Location",
    }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your <span className="text-primary-500">Dream Job</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {pagination.totalJobs} {pagination.totalJobs === 1 ? "job" : "jobs"}{" "}
            available
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Keyword Search */}
                <Input
                  label="Keywords"
                  type="text"
                  name="keyword"
                  value={localFilters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Job title, skills..."
                  leftIcon={<Search size={18} />}
                />

                {/* Location */}
                <Input
                  label="Location"
                  type="text"
                  name="location"
                  value={localFilters.location}
                  onChange={handleFilterChange}
                  placeholder="City, state..."
                  leftIcon={<MapPin size={18} />}
                />

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <select
                      name="jobType"
                      value={localFilters.jobType}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Search size={18} />}
                >
                  Search Jobs
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Active Filters:
              </span>
              {activeFilters.map(({ key, value, label }) => (
                <Chip
                  key={key}
                  onRemove={() => handleRemoveFilter(key)}
                  className="bg-primary-100 text-primary-700 border-primary-300"
                >
                  {label}: {value}
                </Chip>
              ))}
              <button
                onClick={handleClearAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  {/* Company logo placeholder */}
                  <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    {/* Job title */}
                    <div className="h-5 bg-gray-200 rounded-full w-2/5" />
                    {/* Company + location */}
                    <div className="flex gap-3">
                      <div className="h-3.5 bg-gray-200 rounded-full w-1/5" />
                      <div className="h-3.5 bg-gray-200 rounded-full w-1/6" />
                    </div>
                    {/* Tags row */}
                    <div className="flex gap-2 pt-1">
                      <div className="h-6 bg-gray-200 rounded-full w-20" />
                      <div className="h-6 bg-gray-200 rounded-full w-16" />
                      <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>
                  </div>
                  {/* Apply button placeholder */}
                  <div className="h-10 bg-gray-200 rounded-full w-28 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="text-red-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 font-semibold mb-1">
                  Error Loading Jobs
                </h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Job Listings */}
        {!loading && !error && (
          <>
            {jobs.length === 0 ? (
              <motion.div
                className="text-center py-16 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more
                  opportunities.
                </p>
                <Button variant="primary" onClick={handleClearAll}>
                  Browse All Jobs
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {jobs.map((job) => (
                  <motion.div key={job._id} variants={itemVariants}>
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-2 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.currentPage;

                    // Show first page, last page, current page, and pages around current
                    const shouldShow =
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 1 &&
                        page <= pagination.currentPage + 1);

                    if (!shouldShow) {
                      // Show ellipsis
                      if (
                        page === pagination.currentPage - 2 ||
                        page === pagination.currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isCurrentPage
                            ? "bg-primary-500 text-white"
                            : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Jobs;
