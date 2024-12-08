const request = require("supertest");
const app = require("../server"); // Adjust path if needed

describe("Basic server test", () => {
  test("should return 200 for GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
});



// const request = require("supertest");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const mongoose = require("mongoose");
// const app = require("../server"); // Import your Express app
// const User = require("../models/User"); // Adjust path to your User model

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   await mongoose.connect(mongoServer.getUri(), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterEach(async () => {
//   // Clear users collection
//   await User.deleteMany({});
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoose.connection.close();
//   await mongoServer.stop();
// });

// test("should register a new user", async () => {
//   const response = await request(app)
//     .post("/api/users/register")
//     .send({
//       name: "Test User",
//       email: "test@example.com",
//       password: "password123",
//       role: "player",
//     });

//   console.log(response.body); // Log response for debugging

//   expect(response.status).toBe(201);
//   expect(response.body).toHaveProperty("message", "Registration successful");
//   expect(response.body.user).toHaveProperty("email", "test@example.com");
// });
