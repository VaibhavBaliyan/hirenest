import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { Button } from "../../components/ui";

function CreateJob() {
  const navigate = useNavigate();
  const { company } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "full-time",
    salaryMin: "",
    salaryMax: "",
    experienceMin: "",
    experienceMax: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company) {
      toast.error("Please create a company profile first");
      navigate("/employer/setup-company");
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        salary: {
          min: parseInt(formData.salaryMin),
          max: parseInt(formData.salaryMax),
        },
        experience: {
          min: parseInt(formData.experienceMin),
          max: parseInt(formData.experienceMax),
        },
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await api.post("/api/jobs", jobData);
      toast.success("Job posted successfully! 🎉");
      navigate("/employer/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-primary-600 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Post a New Job</h2>
            <p className="text-primary-100 text-sm mt-1">
              Fill in the details to create a job listing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Job Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                minLength={5}
                maxLength={100}
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Senior React Developer"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                minLength={20}
                maxLength={5000}
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/5000 characters
              </p>
            </div>

            {/* Location & Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. Bangalore, India"
                />
              </div>

              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Type *
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  required
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range (₹ per year) *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="salaryMin"
                    required
                    min="0"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Min (e.g. 500000)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum</p>
                </div>
                <div>
                  <input
                    type="number"
                    name="salaryMax"
                    required
                    min="0"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Max (e.g. 1000000)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum</p>
                </div>
              </div>
            </div>

            {/* Experience Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Required (years) *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="experienceMin"
                    required
                    min="0"
                    value={formData.experienceMin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Min (e.g. 2)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum years</p>
                </div>
                <div>
                  <input
                    type="number"
                    name="experienceMax"
                    required
                    min="0"
                    value={formData.experienceMax}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Max (e.g. 5)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum years</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Required Skills *
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. React, Node.js, MongoDB, TypeScript (comma-separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate("/employer/dashboard")}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                fullWidth
              >
                {loading ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;
