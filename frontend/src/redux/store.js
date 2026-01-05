import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import applicationReducer from "./slices/applicationSlice";
import savedJobsReducer from "./slices/savedJobSlice";
import employerReducer from "./slices/employerSlice";
import companyReducer from "./slices/companySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    savedJobs: savedJobsReducer,
    employer: employerReducer,
    company: companyReducer,
  },
});

export default store;
