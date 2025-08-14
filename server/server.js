const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://glowingart-official.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/glowing-gallery", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Initialize notification scheduler
require("./utils/scheduler")

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))
app.use("/api/categories", require("./routes/categories"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/payments", require("./routes/payments"))

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Glowing Gallery API Server" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
