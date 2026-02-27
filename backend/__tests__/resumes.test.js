import request from "supertest";
import app from "../server.js";
import Resume from "../models/Resume.js";
import { createTestUser, createTestResume } from "./helpers.js";

describe("Resume API", () => {
  describe("GET /api/resumes", () => {
    it("should get user's resumes", async () => {
      const { user, token } = await createTestUser({ role: "jobseeker" });

      // Create test resumes
      await createTestResume(user._id, { fileName: "resume1.pdf" });
      await createTestResume(user._id, {
        fileName: "resume2.pdf",
        isActive: false,
      });

      const res = await request(app)
        .get("/api/resumes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].fileName).toBeDefined();
    });

    it("should return empty array for user with no resumes", async () => {
      const { token } = await createTestUser({ role: "jobseeker" });

      const res = await request(app)
        .get("/api/resumes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("should reject employer from accessing resume routes", async () => {
      const { token } = await createTestUser({ role: "employer" });

      const res = await request(app)
        .get("/api/resumes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/permission/i);
    });
  });

  describe("DELETE /api/resumes/:id", () => {
    it("should delete own resume", async () => {
      const { user, token } = await createTestUser({ role: "jobseeker" });
      const resume = await createTestResume(user._id);

      const res = await request(app)
        .delete(`/api/resumes/${resume._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);

      // Verify deletion
      const deletedResume = await Resume.findById(resume._id);
      expect(deletedResume).toBeNull();
    });

    it("should reject deleting other user's resume", async () => {
      const { user: user1 } = await createTestUser({
        email: "user1@test.com",
        role: "jobseeker",
      });
      const resume = await createTestResume(user1._id);

      const { token: token2 } = await createTestUser({
        email: "user2@test.com",
        role: "jobseeker",
      });

      const res = await request(app)
        .delete(`/api/resumes/${resume._id}`)
        .set("Authorization", `Bearer ${token2}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    it("should return 404 for non-existent resume", async () => {
      const { token } = await createTestUser({ role: "jobseeker" });
      const fakeId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .delete(`/api/resumes/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe("PATCH /api/resumes/:id/activate", () => {
    it("should set active resume and deactivate others", async () => {
      const { user, token } = await createTestUser({ role: "jobseeker" });

      // Create multiple resumes
      const resume1 = await createTestResume(user._id, { isActive: true });
      const resume2 = await createTestResume(user._id, { isActive: false });

      // Activate resume2
      const res = await request(app)
        .patch(`/api/resumes/${resume2._id}/activate`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/activated successfully/i);
      expect(res.body.resume.isActive).toBe(true);

      // Verify resume1 is now inactive
      const updatedResume1 = await Resume.findById(resume1._id);
      expect(updatedResume1.isActive).toBe(false);

      // Verify resume2 is active
      const updatedResume2 = await Resume.findById(resume2._id);
      expect(updatedResume2.isActive).toBe(true);
    });

    it("should reject activating other user's resume", async () => {
      const { user: user1 } = await createTestUser({
        email: "user1@test.com",
        role: "jobseeker",
      });
      const resume = await createTestResume(user1._id);

      const { token: token2 } = await createTestUser({
        email: "user2@test.com",
        role: "jobseeker",
      });

      const res = await request(app)
        .patch(`/api/resumes/${resume._id}/activate`)
        .set("Authorization", `Bearer ${token2}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
