import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import accountRoutes from "./routes/accounts.js"
import incomeRoutes from "./routes/incomes.js"
import expenseRoutes from "./routes/expenses.js"
import savingsRoutes from "./routes/savings.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/incomes", incomeRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/savings", savingsRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running")
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

