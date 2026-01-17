import mongoose from "mongoose";
import Session from "../models/Session.js";

class Database {
  constructor() {
    this.connect();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_CONNECT_STRING, {
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 5000,
      });
      console.log("Connected To DB", mongoose.connection.name);
      await Session.createIndexes();
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      process.exit(1);
    }
  }
}

export default Database;
