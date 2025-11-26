import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongodbURI = process.env.MONGODB_URI;

    if (!mongodbURI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    const projectName = "Resume-Builder";
    const fullURI = mongodbURI.endsWith("/")
      ? `${mongodbURI}${projectName}`
      : `${mongodbURI}/${projectName}`;

    await mongoose.connect(fullURI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;
