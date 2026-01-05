import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyCompany, updateCompany } from "../../redux/slices/companySlice";
import toast from "react-hot-toast";

function CompanyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company, loading, error } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    location: "",
    description: "",
    logo: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchMyCompany());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        website: company.website || "",
        location: company.location || "",
        description: company.description || "",
        logo: company.logo || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateCompany(formData)).unwrap();
      toast.success("Company profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update company profile");
    }
  };

  if (loading && !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If fetched but no company returned (and not loading), redirect/show setup
  // However, check if error indicates 404
  if (!loading && !company && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">🏢</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Company Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't set up your company profile yet.
          </p>
          <button
            onClick={() => navigate("/employer/setup-company")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Create Company Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header / Banner */}
          <div className="bg-blue-600 px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white">
              Company Details
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name *
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <div className="mt-1">
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={1000}
                      value={formData.description}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl border border-gray-200">
                      {company?.logo ? (
                        <img
                          src={company.logo}
                          alt={company.companyName}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <span>🏢</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {company?.companyName}
                      </h2>
                      {company?.location && (
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                          📍 {company.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {company?.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      Visit Website 🔗
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    About Company
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {company?.description || "No description provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;
