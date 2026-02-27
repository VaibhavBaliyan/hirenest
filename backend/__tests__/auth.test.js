import request from "supertest";
import app from "../server.js";
import User from "../models/User.js";
import { createTestUser, generateTestToken } from "./helpers.js";

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "Test@123",
        role: "jobseeker",
        phone: "9876543210",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe("john@example.com");
      expect(res.body.role).toBe("jobseeker");
      expect(res.body).not.toHaveProperty("password"); // Password should not be returned
    });

    it("should register an employer user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Employer User",
        email: "employer@example.com",
        password: "Test@123",
        role: "employer",
        phone: "9876543210",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.role).toBe("employer");
    });

    it("should reject duplicate email", async () => {
      await createTestUser({ email: "duplicate@example.com" });

      const res = await request(app).post("/api/auth/register").send({
        name: "Duplicate User",
        email: "duplicate@example.com",
        password: "Test@123",
        role: "jobseeker",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already exists|duplicate/i);
    });

    it("should reject weak password (less than 6 characters)", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "123",
        role: "jobseeker",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "invalid-email-format",
        password: "Test@123",
        role: "jobseeker",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should reject missing required fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        // Missing email, password, role
      });

      expect(res.statusCode).toBe(400);
    });

    it("should reject invalid role", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Test@123",
        role: "invalid_role",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    let testUser;
    let testPassword = "Test@123";

    beforeEach(async () => {
      // Create user with known password
      const userData = {
        name: "Login Test User",
        email: "logintest@example.com",
        password: testPassword,
        role: "jobseeker",
      };

      const result = await createTestUser(userData);
      testUser = result.user;
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testPassword,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.role).toBe("jobseeker");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should reject invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: testPassword,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid (email|password|credentials)/i);
    });

    it("should reject invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid (email|password|credentials)/i);
    });

    it("should reject missing email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        password: testPassword,
      });

      expect(res.statusCode).toBe(400);
    });

    it("should reject missing password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    let testUser, testToken;

    beforeEach(async () => {
      const result = await createTestUser();
      testUser = result.user;
      testToken = result.token;
    });

    it("should return current user with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user._id).toBe(testUser._id.toString());
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token|not authorized|unauthorized/i);
    });

    it("should reject request with invalid token format", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token-format");

      expect(res.statusCode).toBe(401);
    });

    it("should reject expired token", async () => {
      const expiredToken = generateTestToken(testUser._id, "-1h"); // Expired 1 hour ago

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(
        /not authorized|token failed|expired|invalid/i,
      );
    });

    it("should reject token without Bearer prefix", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", testToken); // Missing "Bearer "

      expect(res.statusCode).toBe(401);
    });

    it("should reject token for deleted user", async () => {
      // Delete the user
      await User.findByIdAndDelete(testUser._id);

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Token Security", () => {
    it("should generate unique tokens for different users", async () => {
      const { token: token1 } = await createTestUser({
        email: "user1@example.com",
      });
      const { token: token2 } = await createTestUser({
        email: "user2@example.com",
      });

      expect(token1).not.toBe(token2);
    });

    it("should hash passwords before storing", async () => {
      const password = "Test@123";
      const { user } = await createTestUser({ password });

      const userFromDb = await User.findById(user._id).select("+password");
      expect(userFromDb.password).not.toBe(password);
      expect(userFromDb.password.length).toBeGreaterThan(20); // bcrypt hashes are long
    });
  });
});
