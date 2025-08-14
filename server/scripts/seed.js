const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Product = require("../models/Product")
const Admin = require("../models/Admin")
const Order = require("../models/Order")
const Category = require("../models/Category")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/glowing-gallery"
    console.log("Connecting to MongoDB:", mongoUri.replace(/\/\/[^:]*:[^@]*@/, "//***:***@"))
    await mongoose.connect(mongoUri)
    console.log("MongoDB connected for seeding...")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

const sampleProducts = [
  {
    name: "Your Name",
    description:
      "Beautiful framed artwork featuring the iconic scene from Your Name anime. Perfect for any anime lover's collection.",
    category: "More Anime",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-z8Vm56MTH2alsrQ8z4i6Eeo7pUIdbk.png",
        publicId: "your_name_frame",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 13100,
        originalPrice: 16000,
      },
      {
        name: "Large",
        price: 18500,
        originalPrice: 22000,
      },
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 156,
    tags: ["anime", "your name", "romantic", "framed"],
  },
  {
    name: "Cyberpunk Edgerunners",
    description:
      "Stunning cyberpunk artwork featuring neon colors and futuristic aesthetics. A must-have for sci-fi enthusiasts.",
    category: "More Anime",
    images: [
      {
        url: "/cyberpunk-edgerunners-neon.png",
        publicId: "cyberpunk_edgerunners",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 12500,
        originalPrice: 15000,
      },
      {
        name: "Large",
        price: 17800,
        originalPrice: 21000,
      },
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 203,
    tags: ["cyberpunk", "anime", "neon", "futuristic"],
  },
  {
    name: "Luffy Gear 5",
    description: "Epic One Piece artwork showcasing Luffy's ultimate transformation. Perfect for any One Piece fan.",
    category: "One Piece",
    images: [
      {
        url: "/luffy-gear-5-artwork.png",
        publicId: "luffy_gear5",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 14200,
        originalPrice: 17500,
      },
      {
        name: "Large",
        price: 19800,
        originalPrice: 24000,
      },
    ],
    inStock: true,
    featured: false,
    rating: 4.7,
    reviewCount: 89,
    tags: ["one piece", "luffy", "gear 5", "manga"],
  },
  {
    name: "Zoro Three Sword Style",
    description: "Dynamic artwork featuring Roronoa Zoro in his iconic three sword fighting stance.",
    category: "One Piece",
    images: [
      {
        url: "/roronoa-zoro-three-sword-style.png",
        publicId: "zoro_three_sword",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 13800,
        originalPrice: 16800,
      },
      {
        name: "Large",
        price: 19200,
        originalPrice: 23000,
      },
    ],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviewCount: 67,
    tags: ["one piece", "zoro", "swords", "samurai"],
  },
  {
    name: "Attack on Titan Final Season",
    description: "Dramatic artwork from the final season of Attack on Titan. Limited edition print.",
    category: "Limited Designs",
    images: [
      {
        url: "/aot-final-season.png",
        publicId: "aot_final",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 15500,
        originalPrice: 19000,
      },
      {
        name: "Large",
        price: 21800,
        originalPrice: 26500,
      },
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 312,
    tags: ["attack on titan", "limited", "final season", "titans"],
  },
  {
    name: "Demon Slayer Tanjiro",
    description: "Beautiful artwork featuring Tanjiro Kamado with his water breathing technique visualization.",
    category: "More Anime",
    images: [
      {
        url: "/placeholder-8vy2j.png",
        publicId: "tanjiro_water",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 13500,
        originalPrice: 16200,
      },
      {
        name: "Large",
        price: 18800,
        originalPrice: 22500,
      },
    ],
    inStock: true,
    featured: false,
    rating: 4.8,
    reviewCount: 145,
    tags: ["demon slayer", "tanjiro", "water breathing", "sword"],
  },
  {
    name: "Naruto and Sasuke",
    description: "Iconic artwork featuring the eternal rivals Naruto and Sasuke in their final battle pose.",
    category: "Never Forgotten",
    images: [
      {
        url: "/naruto-sasuke-final-battle.png",
        publicId: "naruto_sasuke",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 14800,
        originalPrice: 18000,
      },
      {
        name: "Large",
        price: 20500,
        originalPrice: 25000,
      },
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 278,
    tags: ["naruto", "sasuke", "rivals", "ninja"],
  },
  {
    name: "Dragon Ball Z Goku Ultra Instinct",
    description: "Spectacular artwork showcasing Goku in his Ultra Instinct form with silver hair and aura.",
    category: "Never Forgotten",
    images: [
      {
        url: "/goku-ultra-instinct-silver-hair-aura.png",
        publicId: "goku_ui",
      },
    ],
    sizes: [
      {
        name: "Small",
        price: 15200,
        originalPrice: 18500,
      },
      {
        name: "Large",
        price: 21200,
        originalPrice: 25800,
      },
    ],
    inStock: true,
    featured: false,
    rating: 4.7,
    reviewCount: 198,
    tags: ["dragon ball z", "goku", "ultra instinct", "transformation"],
  },
]

const sampleAdmin = {
  username: "admin",
  email: "admin@glowinggallery.com",
  password: "admin123", // Will be hashed by the pre-save middleware
  role: "admin",
}

const sampleCategories = [
  {
    name: "One Piece",
    description: "Epic artwork from the world of One Piece featuring your favorite pirates and characters.",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Never Forgotten",
    description: "Timeless anime classics and iconic characters that will never be forgotten.",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "More Anime",
    description: "Diverse collection of anime artwork from various series and genres.",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Limited Designs",
    description: "Exclusive and limited edition artwork - get them before they're gone!",
    isActive: true,
    sortOrder: 4,
  },
]

const sampleOrders = [
  {
    orderNumber: "GG-001-2024",
    customerInfo: {
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+92-300-1234567",
      address: "123 Main Street, Block A",
      city: "Karachi",
      postalCode: "75500",
      country: "Pakistan",
    },
    items: [
      {
        productName: "Your Name",
        size: "Small",
        quantity: 1,
        price: 13100,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-z8Vm56MTH2alsrQ8z4i6Eeo7pUIdbk.png",
      },
    ],
    subtotal: 13100,
    shippingProtection: {
      enabled: true,
      cost: 600,
    },
    total: 13700,
    paymentMethod: "JazzCash",
    paymentStatus: "paid",
    orderStatus: "delivered",
  },
  {
    orderNumber: "GG-002-2024",
    customerInfo: {
      email: "sarah.ahmed@example.com",
      firstName: "Sarah",
      lastName: "Ahmed",
      phone: "+92-321-9876543",
      address: "456 Garden Road, Gulshan",
      city: "Lahore",
      postalCode: "54000",
      country: "Pakistan",
    },
    items: [
      {
        productName: "Luffy Gear 5",
        size: "Large",
        quantity: 1,
        price: 19800,
      },
      {
        productName: "Zoro Three Sword Style",
        size: "Small",
        quantity: 1,
        price: 13800,
      },
    ],
    subtotal: 33600,
    shippingProtection: {
      enabled: false,
      cost: 0,
    },
    discountCode: {
      code: "ANIME10",
      discount: 3360,
    },
    total: 30240,
    paymentMethod: "Easypaisa",
    paymentStatus: "pending",
    orderStatus: "processing",
  },
  {
    orderNumber: "GG-003-2024",
    customerInfo: {
      email: "ali.hassan@example.com",
      firstName: "Ali",
      lastName: "Hassan",
      phone: "+92-333-5555555",
      address: "789 University Road",
      city: "Islamabad",
      postalCode: "44000",
      country: "Pakistan",
    },
    items: [
      {
        productName: "Attack on Titan Final Season",
        size: "Large",
        quantity: 2,
        price: 21800,
      },
    ],
    subtotal: 43600,
    shippingProtection: {
      enabled: true,
      cost: 600,
    },
    total: 44200,
    paymentMethod: "Bank Transfer",
    paymentStatus: "paid",
    orderStatus: "shipped",
  },
]

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log("Clearing existing data...")
    await Product.deleteMany({})
    await Admin.deleteMany({})
    await Order.deleteMany({})
    await Category.deleteMany({})

    // Create categories
    console.log("Creating categories...")
    const createdCategories = await Category.insertMany(sampleCategories)
    console.log(`✅ ${createdCategories.length} categories created successfully`)

    // Create admin user
    console.log("Creating admin user...")
    const admin = new Admin(sampleAdmin)
    await admin.save()
    console.log("✅ Admin user created successfully")
    console.log(`Admin credentials: ${sampleAdmin.email} / ${sampleAdmin.password}`)

    // Create products
    console.log("Creating sample products...")
    const createdProducts = await Product.insertMany(sampleProducts)
    console.log(`✅ ${createdProducts.length} products created successfully`)

    // Update orders with actual product IDs
    console.log("Creating sample orders...")
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = sampleOrders[i]

      // Find matching products and update order items
      for (let j = 0; j < orderData.items.length; j++) {
        const item = orderData.items[j]
        const product = createdProducts.find((p) => p.name === item.productName)
        if (product) {
          item.product = product._id
          item.image = product.images[0]?.url || item.image
        }
      }

      const order = new Order(orderData)
      await order.save()
    }
    console.log(`✅ ${sampleOrders.length} orders created successfully`)

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📊 Summary:")
    console.log(`- Categories: ${createdCategories.length}`)
    console.log(`- Products: ${createdProducts.length}`)
    console.log(`- Admin users: 1`)
    console.log(`- Orders: ${sampleOrders.length}`)
    console.log("\n🔐 Admin Login:")
    console.log(`Email: ${sampleAdmin.email}`)
    console.log(`Password: ${sampleAdmin.password}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await mongoose.connection.close()
    console.log("\n📝 Database connection closed")
    process.exit(0)
  }
}

// Run the seed script
const runSeed = async () => {
  await connectDB()
  await seedDatabase()
}

// Check if script is run directly
if (require.main === module) {
  runSeed()
}

module.exports = { runSeed, sampleProducts, sampleAdmin, sampleOrders, sampleCategories }
