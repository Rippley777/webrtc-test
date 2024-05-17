const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../");
const db = require("../db");

jest.mock("../db");

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
      return Promise.resolve();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
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
