import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Register new company
// @route   POST /api/companies
// @access  Private (Employer only)
export const registerCompany = asyncHandler(async (req, res, next) => {
  const { companyName, description, website, logo, location } = req.body;

  // Check if employer already has a company (Optional: allowing 1 company per employer?)
  // For simplicity, let's assume 1-1 relationship for now as per jobController check
  const companyExists = await Company.findOne({ employerId: req.user._id });

  if (companyExists) {
    throw new AppError("Employer already has a registered company", 400);
  }

  const company = await Company.create({
    employerId: req.user._id,
    companyName,
    description,
    website,
    logo,
    location,
  });

  res.status(201).json(company);
});

// @desc    Get current employer's company
// @route   GET /api/companies/mine
// @access  Private (Employer only)
export const getMyCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findOne({ employerId: req.user._id });

  if (!company) {
    throw new AppError("No company profile found", 404);
  }

  res.json(company);
});

// @desc    Update company profile
// @route   PUT /api/companies/mine
// @access  Private (Employer only)
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { companyName, description, website, logo, location } = req.body;

  let company = await Company.findOne({ employerId: req.user._id });

  if (!company) {
    throw new AppError("No company profile found", 404);
  }

  company.companyName = companyName || company.companyName;
  company.description = description || company.description;
  company.website = website || company.website;
  company.logo = logo || company.logo;
  company.location = location || company.location;

  const updatedCompany = await company.save();

  res.json(updatedCompany);
});
