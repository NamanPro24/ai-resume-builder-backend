import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
await connectDB();

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully...");
});


app.use('/api/users',userRouter)

app.use('/api/resumes',resumeRouter)
app.use('/api/ai',aiRouter)
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
