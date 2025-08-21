const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

// Check if Cloudinary is configured; if not, use in-memory fallback
const hasCloudinaryConfig =
  !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const isImage = file.mimetype && file.mimetype.startsWith("image/")
        return {
          folder: "glowing-gallery",
          resource_type: "auto", // allow images and pdfs
          allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
          // Only apply transformations to images
          transformation: isImage
            ? [{ width: 1000, height: 1000, crop: "limit", quality: "auto" }]
            : undefined,
        }
      },
    })
  : multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype && file.mimetype.startsWith("image/")
    const isPdf = file.mimetype === "application/pdf"
    if (isImage || isPdf) {
      cb(null, true)
    } else {
      const err = new Error("Only image files or PDF are allowed")
      err.statusCode = 400
      cb(err, false)
    }
  },
})

module.exports = { upload, hasCloudinaryConfig }
