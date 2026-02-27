import mongoose from "mongoose";
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Connect to test database before all tests
beforeAll(async () => {
  try {
    // Use MongoDB Atlas or local MongoDB with a test database name
    const testMongoUri =
      process.env.MONGO_URI_TEST ||
      process.env.MONGO_URI?.replace(/\/\w+(\?|$)/, "/hirenest_test$1") ||
      "mongodb://localhost:27017/hirenest_test";

    await mongoose.connect(testMongoUri);
    console.log("✅ Test database connected");
  } catch (error) {
    console.error("❌ Test database connection failed:", error);
    throw error;
  }
});

// Clear all collections between tests
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Disconnect after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  console.log("✅ Test database disconnected");
});

// Optional: Suppress console logs during tests
// Commented out because jest global is not available in ES modules
// Uncomment if you want to suppress logs:
// const originalConsole = console;
// global.console = {
//   ...console,
//   log: () => {},
//   debug: () => {},
//   info: () => {},
//   warn: () => {},
//   error: originalConsole.error, // Keep errors for debugging
// };
