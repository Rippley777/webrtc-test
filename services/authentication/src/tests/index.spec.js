const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = require("../");
const db = require("../db");

jest.mock("../db");
jest.mock("bcryptjs");

describe("Auth Service", () => {
  beforeAll(() => {
    // Define the mock implementation for the db.query function
    db.query.mockImplementation((query, values) => {
      if (query.includes("SELECT role FROM users WHERE username = $1")) {
        if (values[0] === "testuser") {
          return Promise.resolve({
            rows: [{ role: "user" }],
          });
        }
        return Promise.resolve({
          rows: [],
        });
      }

      if (query.includes("INSERT INTO users")) {
        console.log("INSERT INTO users", values);
        // return Promise.resolve({"User created successfully"});
      }

      return Promise.resolve();
    });

    // Define the mock implementation for the bcrypt.compare function
    jest.mock("bcrypt", () => {
      return {
        compare: (password, hash) => {
          return password === "testpassword";
        },
      };
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("POST /register", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/register").send({
        username: "testuser",
        email: "test@test.com",
        password: "testpassword",
      });
      expect(response.status).toBe(200);
      expect(db.query).toHaveBeenCalled();
    });

    it("should return 409 if user already exists", async () => {
      db.query.mockRejectedValue({ code: "23505" });
      const response = await request(app).post("/register").send({
        username: "testuser",
        email: "test@test.com",
        password: "testpassword",
      });
      expect(response.status).toBe(409);
    });

    it("should return 500 if an error occurs", async () => {
      db.query.mockRejectedValue(new Error("Test error"));
      const response = await request(app).post("/register").send({
        username: "testuser",
        email: "test@test.com",
        password: "testpassword",
      });
      expect(response.status).toBe(500);
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/register").send({
        username: "testuser",
        email: "test",
        password: "testpassword",
      });
      expect(response.status).toBe(400);
    });

    it("should fail if no email is provided", async () => {
      const response = await request(app).post("/register").send({
        username: "testuser",
        password: "testpassword",
      });
      expect(response.status).toBe(400);
    });

    it("should fail if no username is provided", async () => {
      const response = await request(app).post("/register").send({
        email: "test@test.com",
        password: "testpassword",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("GET /user-role", () => {
    it("should return user role if authenticated", async () => {
      const token = jwt.sign({ username: "testuser" }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .get("/user-role")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("role");
    });
  });
});
