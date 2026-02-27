import request from "supertest";
import app from "../server.js";
import Job from "../models/Job.js";
import {
  createTestEmployer,
  createTestUser,
  createTestJob,
} from "./helpers.js";

describe("Job API", () => {
  describe("POST /api/jobs", () => {
    it("should create a job by employer with company", async () => {
      const { employer, company, token } = await createTestEmployer();

      const jobData = {
        title: "Senior Software Engineer",
        description: "Looking for an experienced software engineer",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: {
          min: 80000,
          max: 120000,
          currency: "INR",
        },
        skills: ["JavaScript", "React", "Node.js"],
        experience: { min: 3, max: 7 },
      };

      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send(jobData);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(jobData.title);
      expect(res.body.company).toBe(company._id.toString());
      expect(res.body.employerId).toBe(employer._id.toString());
      expect(res.body.status).toBe("active");
    });

    it("should reject job creation by jobseeker", async () => {
      const { token } = await createTestUser({ role: "jobseeker" });

      const jobData = {
        title: "Test Job",
        description: "Test description",
        location: "Test Location",
      };

      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send(jobData);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/permission/i);
    });

    it("should reject job creation without company", async () => {
      // Create employer but no company
      const { token } = await createTestUser({ role: "employer" });

      const jobData = {
        title: "Software Engineer Test Position",
        description:
          "This is a test job description with minimum required length",
        location: "Test Location",
        jobType: "full-time",
      };

      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send(jobData);

      expect(res.statusCode).toBe(400);
      // Employer without company should get 400 error from controller
    });
  });

  describe("GET /api/jobs", () => {
    beforeEach(async () => {
      // Create test jobs
      const { employer, company } = await createTestEmployer();

      await createTestJob(employer._id, company._id, {
        title: "React Developer",
        location: "Mumbai, Maharashtra",
        jobType: "full-time",
        status: "active",
      });

      await createTestJob(employer._id, company._id, {
        title: "Node.js Developer",
        location: "Bangalore, Karnataka",
        jobType: "remote",
        status: "active",
      });

      await createTestJob(employer._id, company._id, {
        title: "Python Developer",
        location: "Delhi, NCR",
        jobType: "contract",
        status: "closed", // This should not appear in results
      });
    });

    it("should get all active jobs", async () => {
      const res = await request(app).get("/api/jobs");

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs).toBeDefined();
      expect(res.body.jobs.length).toBe(2); // Only active jobs
      expect(res.body.totalJobs).toBe(2);
    });

    it("should filter jobs by location", async () => {
      const res = await request(app).get("/api/jobs?location=Mumbai");

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].location).toMatch(/Mumbai/i);
    });

    it("should filter jobs by job type", async () => {
      const res = await request(app).get("/api/jobs?jobType=remote");

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs.length).toBe(1);
      expect(res.body.jobs[0].jobType).toBe("remote");
    });
  });

  describe("GET /api/jobs/:id", () => {
    it("should get single job by ID", async () => {
      const { employer, company } = await createTestEmployer();
      const job = await createTestJob(employer._id, company._id);

      const res = await request(app).get(`/api/jobs/${job._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(job._id.toString());
      expect(res.body.title).toBe(job.title);
      expect(res.body.company).toBeDefined();
    });

    it("should return 404 for non-existent job", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app).get(`/api/jobs/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe("PUT /api/jobs/:id", () => {
    it("should update own job", async () => {
      const { employer, company, token } = await createTestEmployer();
      const job = await createTestJob(employer._id, company._id);

      const updates = {
        title: "Updated Job Title",
        description:
          "This is an updated job description with enough characters",
      };

      const res = await request(app)
        .put(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updates.title);
      expect(res.body.description).toBe(updates.description);
    });

    it("should reject update of other user's job", async () => {
      // Create job by employer1
      const { employer: employer1, company: company1 } =
        await createTestEmployer();
      const job = await createTestJob(employer1._id, company1._id);

      // Try to update with employer2's token
      const { token: token2 } = await createTestEmployer(
        {
          email: "employer2@test.com",
        },
        {
          name: "Company 2",
        },
      );

      const res = await request(app)
        .put(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({ title: "Hacked Title" });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  describe("DELETE /api/jobs/:id", () => {
    it("should delete own job (soft delete)", async () => {
      const { employer, company, token } = await createTestEmployer();
      const job = await createTestJob(employer._id, company._id);

      const res = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);

      // Verify it's soft deleted (status = closed)
      const deletedJob = await Job.findById(job._id);
      expect(deletedJob.status).toBe("closed");
    });

    it("should reject deletion of other user's job", async () => {
      // Create job by employer1
      const { employer: employer1, company: company1 } =
        await createTestEmployer();
      const job = await createTestJob(employer1._id, company1._id);

      // Try to delete with employer2's token
      const { token: token2 } = await createTestEmployer(
        {
          email: "employer2@test.com",
        },
        {
          name: "Company 2",
        },
      );

      const res = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token2}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  describe("PATCH /api/jobs/:id/close", () => {
    it("should close/reopen job", async () => {
      const { employer, company, token } = await createTestEmployer();
      const job = await createTestJob(employer._id, company._id, {
        status: "active",
      });

      const res = await request(app)
        .patch(`/api/jobs/${job._id}/close`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/closed successfully/i);
      expect(res.body.job.status).toBe("closed");
    });

    it("should reject closing already closed job", async () => {
      const { employer, company, token } = await createTestEmployer();
      const job = await createTestJob(employer._id, company._id, {
        status: "closed",
      });

      const res = await request(app)
        .patch(`/api/jobs/${job._id}/close`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already closed/i);
    });
  });
});
