const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/database")

// Load environment variables
dotenv.config()

const app = express()

// Configure CORS to allow requests from your frontend domain
const corsOptions = {
  origin: [
    "https://www.glowing-art.com",
    "https://glowing-art.com",
    "http://localhost:3000" // For local development
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB (remove the old connection code)
connectDB();

// Initialize notification scheduler (comment out for serverless)
// require("./utils/scheduler")

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))
app.use("/api/categories", require("./routes/categories"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/payments", require("./routes/payments"))
app.use("/api/coupons", require("./routes/coupons"))

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Glowing Gallery API Server" })
})

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = app;
