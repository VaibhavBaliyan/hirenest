import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

/**
 * Generate a test JWT token
 * @param {string} userId - User ID to encode in token
 * @param {string} expiresIn - Token expiration time (default: '1h')
 * @returns {string} JWT token
 */
export const generateTestToken = (userId, expiresIn = "1h") => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "test_secret_key_for_testing",
    { expiresIn },
  );
};

/**
 * Create a test user (jobseeker by default)
 * @param {Object} overrides - Properties to override default user
 * @returns {Promise<{user: Object, token: string}>}
 */
export const createTestUser = async (overrides = {}) => {
  const timestamp = Date.now();
  const defaultUser = {
    name: "Test User",
    email: `test${timestamp}@example.com`,
    password: "Test@123",
    role: "jobseeker",
    phone: "9876543210",
  };

  const user = await User.create({ ...defaultUser, ...overrides });
  const token = generateTestToken(user._id);

  return { user, token };
};

/**
 * Create a test employer with associated company
 * @param {Object} employerOverrides - Employer user overrides
 * @param {Object} companyOverrides - Company overrides
 * @returns {Promise<{employer: Object, company: Object, token: string}>}
 */
export const createTestEmployer = async (
  employerOverrides = {},
  companyOverrides = {},
) => {
  const timestamp = Date.now();
  const { user: employer, token } = await createTestUser({
    role: "employer",
    email: `employer${timestamp}@example.com`,
    ...employerOverrides,
  });

  const defaultCompany = {
    companyName: "Test Company Inc",
    description: "A test company for testing purposes",
    website: "https://testcompany.com",
    location: "Mumbai, Maharashtra",
    employerId: employer._id,
  };

  const company = await Company.create({
    ...defaultCompany,
    ...companyOverrides,
  });

  return { employer, company, token };
};

/**
 * Create a test job
 * @param {string} employerId - ID of the employer who posted the job
 * @param {string} companyId - ID of the company
 * @param {Object} overrides - Job property overrides
 * @returns {Promise<Object>} Created job
 */
export const createTestJob = async (employerId, companyId, overrides = {}) => {
  const defaultJob = {
    title: "Software Engineer",
    description:
      "We are looking for a talented software engineer to join our team.",
    location: "Bangalore, Karnataka",
    jobType: "full-time",
    salary: {
      min: 60000,
      max: 100000,
      currency: "INR",
    },
    skills: ["JavaScript", "React", "Node.js"],
    experience: { min: 2, max: 5 },
    company: companyId,
    employerId: employerId,
  };

  return await Job.create({ ...defaultJob, ...overrides });
};

/**
 * Create a test resume
 * @param {string} userId - User ID who owns the resume
 * @param {Object} overrides - Resume property overrides
 * @returns {Promise<Object>} Created resume
 */
export const createTestResume = async (userId, overrides = {}) => {
  const defaultResume = {
    userId: userId,
    fileName: "test-resume.pdf",
    fileUrl: "https://res.cloudinary.com/test/resume.pdf",
    fileSize: 245678,
    cloudinaryId: "test_cloudinary_id",
    isActive: true,
  };

  return await Resume.create({ ...defaultResume, ...overrides });
};

/**
 * Wait for a specified time (useful for async operations)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
