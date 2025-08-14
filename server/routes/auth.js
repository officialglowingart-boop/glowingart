const express = require("express")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const auth = require("../middleware/auth")

const router = express.Router()

// Admin login
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
    })

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create first admin (development only)
router.post("/admin/create", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    })

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const admin = new Admin({
      username,
      email,
      password,
    })

    await admin.save()

    res.status(201).json({ message: "Admin created successfully" })
  } catch (error) {
    console.error("Create admin error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Verify token
router.get("/admin/verify", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select("-password")
    res.json({ admin })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
