const mongoose = require("mongoose")
const Review = require("../models/Review")
const Product = require("../models/Product")
require("dotenv").config()

const productImages = [
  // Add your product image URLs here, for example:
  // "https://example.com/product1.jpg",
  // "https://example.com/product2.jpg",
  // "https://example.com/product3.jpg",
  // ... add 10-15 product images
]

const islamicNames = [
  // Male Names
  "Muhammad Ali",
  "Ahmad Hassan",
  "Omar Farooq",
  "Abdullah Shah",
  "Usman Tariq",
  "Hassan Raza",
  "Ibrahim Qureshi",
  "Bilal Ahmad",
  "Yusuf Khan",
  "Hamza Sheikh",
  "Talha Mahmood",
  "Saad Iqbal",
  "Faisal Rehman",
  "Junaid Akbar",
  "Arslan Baig",
  "Kashif Nawaz",
  "Shahzad Gill",
  "Adnan Malik",
  "Waqas Ahmed",
  "Imran Ali",
  "Tariq Mehmood",
  "Rizwan Shah",
  "Naveed Akhtar",
  "Kamran Hussain",
  "Asif Javed",
  "Zubair Ahmed",
  "Fahad Iqbal",
  "Salman Khan",
  "Waseem Abbas",
  "Aamir Sohail",
  "Babar Azam",
  "Shoaib Malik",
  "Yasir Shah",
  "Hasan Ali",
  "Shadab Khan",
  "Fakhar Zaman",
  "Imam ul Haq",
  "Sarfaraz Ahmed",
  "Wahab Riaz",
  "Mohammad Amir",
  "Azhar Ali",
  "Younis Khan",
  "Misbah ul Haq",
  "Shahid Afridi",
  "Wasim Akram",
  "Waqar Younis",
  "Imran Khan",
  "Javed Miandad",
  "Zaheer Abbas",
  "Hanif Mohammad",
  "Abdul Qadir",
  "Saqlain Mushtaq",
  "Danish Kaneria",
  "Shoaib Akhtar",
  "Mohammad Yousuf",
  "Inzamam ul Haq",
  "Saeed Anwar",
  "Ijaz Ahmed",
  "Saleem Malik",
  "Ramiz Raja",
  "Aamer Sohail",
  "Basit Ali",
  "Asif Mujtaba",
  "Rashid Latif",
  "Moin Khan",
  "Kamran Akmal",
  "Adnan Akmal",
  "Umar Akmal",
  "Ahmed Shehzad",
  "Nasir Jamshed",
  "Mohammad Hafeez",
  "Shoaib Malik",
  "Fawad Alam",
  "Asad Shafiq",
  "Shan Masood",
  "Abid Ali",
  "Abdullah Shafique",
  "Saud Shakeel",
  "Mohammad Rizwan",
  "Iftikhar Ahmed",

  // Female Names
  "Fatima Khan",
  "Aisha Malik",
  "Zainab Ahmed",
  "Khadija Hussain",
  "Maryam Siddique",
  "Ayesha Butt",
  "Hafsa Chaudhry",
  "Ruqayyah Ali",
  "Safia Malik",
  "Zara Fatima",
  "Noor ul Ain",
  "Mariam Ashraf",
  "Hira Noor",
  "Sana Riaz",
  "Laiba Shahid",
  "Rabia Khatoon",
  "Nimra Saleem",
  "Farah Naz",
  "Sidra Khan",
  "Bushra Bibi",
  "Samina Begum",
  "Fouzia Parveen",
  "Shazia Sultana",
  "Rubina Kausar",
  "Nasreen Akhtar",
  "Saira Banu",
  "Nazia Hassan",
  "Shabnam Majeed",
  "Tahira Syed",
  "Farida Khanum",
  "Malika Pukhraj",
  "Noor Jehan",
  "Mehdi Hassan",
  "Ghulam Ali",
  "Ustad Rahat",
  "Abida Parveen",
  "Tina Sani",
  "Hadiqa Kiani",
  "Shazia Manzoor",
  "Sanam Marvi",
  "Zeb Bangash",
  "Rachel Viccaji",
  "Momina Mustehsan",
  "Aima Baig",
  "Asim Azhar",
  "Bilal Saeed",
  "Rahat Fateh",
  "Atif Aslam",
  "Ali Zafar",
  "Ali Azmat",
  "Junoon Band",
  "Strings Band",
  "Vital Signs",
  "Call Band",
  "Jal Band",
  "Fuzon Band",
  "Noori Band",
  "Entity Paradigm",
  "Mizraab Band",
  "Aaroh Band",
  "Roxen Band",
  "Qayaas Band",
  "Overload Band",
  "Karavan Band",

  // Additional unique combinations
  "Muhammad Usman",
  "Ahmad Ali",
  "Omar Hassan",
  "Abdullah Farooq",
  "Usman Shah",
  "Hassan Tariq",
  "Ibrahim Raza",
  "Bilal Qureshi",
  "Yusuf Ahmad",
  "Hamza Khan",
  "Talha Sheikh",
  "Saad Mahmood",
  "Faisal Iqbal",
  "Junaid Rehman",
  "Arslan Akbar",
  "Kashif Baig",
  "Shahzad Nawaz",
  "Adnan Gill",
  "Waqas Malik",
  "Imran Ahmed",
  "Tariq Ali",
  "Rizwan Mehmood",
  "Naveed Shah",
  "Kamran Akhtar",
  "Asif Hussain",
  "Zubair Javed",
  "Fahad Ahmed",
  "Salman Iqbal",
  "Waseem Khan",
  "Aamir Abbas",
  "Babar Sohail",
  "Shoaib Azam",
  "Yasir Malik",
  "Hasan Shah",
  "Shadab Ahmed",
  "Fakhar Zaman",
  "Imam Haq",
  "Sarfaraz Ahmed",
  "Wahab Riaz",
  "Mohammad Amir",

  // More female names
  "Fatima Usman",
  "Aisha Hassan",
  "Zainab Farooq",
  "Khadija Shah",
  "Maryam Tariq",
  "Ayesha Raza",
  "Hafsa Qureshi",
  "Ruqayyah Ahmad",
  "Safia Khan",
  "Zara Sheikh",
  "Noor Mahmood",
  "Mariam Iqbal",
  "Hira Rehman",
  "Sana Akbar",
  "Laiba Baig",
  "Rabia Nawaz",
  "Nimra Gill",
  "Farah Malik",
  "Sidra Ahmed",
  "Bushra Ali",
  "Samina Mehmood",
  "Fouzia Shah",
  "Shazia Akhtar",
  "Rubina Hussain",
  "Nasreen Javed",
  "Saira Ahmed",
  "Nazia Iqbal",
  "Shabnam Khan",
  "Tahira Abbas",
  "Farida Sohail",
  "Malika Azam",
  "Noor Malik",
]

const generateUniqueNames = (count) => {
  const firstNames = [
    "Muhammad",
    "Ahmad",
    "Omar",
    "Abdullah",
    "Usman",
    "Hassan",
    "Ibrahim",
    "Bilal",
    "Yusuf",
    "Hamza",
    "Talha",
    "Saad",
    "Faisal",
    "Junaid",
    "Arslan",
    "Kashif",
    "Shahzad",
    "Adnan",
    "Waqas",
    "Imran",
    "Tariq",
    "Rizwan",
    "Naveed",
    "Kamran",
    "Asif",
    "Zubair",
    "Fahad",
    "Salman",
    "Waseem",
    "Aamir",
    "Babar",
    "Shoaib",
    "Yasir",
    "Hasan",
    "Shadab",
    "Fakhar",
    "Imam",
    "Sarfaraz",
    "Wahab",
    "Mohammad",
    "Azhar",
    "Younis",
    "Misbah",
    "Shahid",
    "Wasim",
    "Waqar",
    "Javed",
    "Zaheer",
    "Hanif",
    "Abdul",
    "Saqlain",
    "Danish",
    "Inzamam",
    "Saeed",
    "Ijaz",
    "Saleem",
    "Ramiz",
    "Aamer",
    "Basit",
    "Rashid",
    "Moin",
    "Adnan",
    "Umar",
    "Ahmed",
    "Nasir",
    "Hafeez",
    "Fawad",
    "Asad",
    "Shan",
    "Abid",
    "Saud",
    "Fatima",
    "Aisha",
    "Zainab",
    "Khadija",
    "Maryam",
    "Ayesha",
    "Hafsa",
    "Ruqayyah",
    "Safia",
    "Zara",
    "Noor",
    "Mariam",
    "Hira",
    "Sana",
    "Laiba",
    "Rabia",
    "Nimra",
    "Farah",
    "Sidra",
    "Bushra",
    "Samina",
    "Fouzia",
    "Shazia",
    "Rubina",
    "Nasreen",
    "Saira",
    "Nazia",
    "Shabnam",
  ]

  const lastNames = [
    "Ali",
    "Khan",
    "Malik",
    "Ahmed",
    "Shah",
    "Hussain",
    "Qureshi",
    "Chaudhry",
    "Sheikh",
    "Mahmood",
    "Iqbal",
    "Rehman",
    "Akbar",
    "Baig",
    "Nawaz",
    "Gill",
    "Tariq",
    "Raza",
    "Butt",
    "Siddique",
    "Ahmad",
    "Farooq",
    "Ashraf",
    "Noor",
    "Riaz",
    "Shahid",
    "Khatoon",
    "Saleem",
    "Naz",
    "Bibi",
    "Mehmood",
    "Begum",
    "Parveen",
    "Akhtar",
    "Sultana",
    "Kausar",
    "Javed",
    "Banu",
    "Hassan",
    "Majeed",
    "Syed",
    "Khanum",
    "Pukhraj",
    "Jehan",
    "Azam",
    "Abbas",
    "Sohail",
    "Amir",
    "Younis",
    "Afridi",
    "Akram",
    "Younis",
    "Miandad",
    "Qadir",
    "Mushtaq",
    "Kaneria",
    "Akhtar",
    "Yousuf",
    "Haq",
    "Anwar",
    "Raja",
    "Mujtaba",
    "Latif",
    "Akmal",
    "Shehzad",
    "Jamshed",
    "Hafeez",
    "Alam",
    "Shafiq",
    "Masood",
    "Shafique",
    "Shakeel",
    "Rizwan",
    "Iftikhar",
    "Zaman",
    "Riaz",
    "Azhar",
    "Misbah",
    "Wasim",
    "Waqar",
    "Imran",
    "Javed",
    "Zaheer",
    "Hanif",
  ]

  const names = new Set()

  // Add existing names
  islamicNames.forEach((name) => names.add(name))

  // Generate more unique combinations
  while (names.size < count) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    names.add(`${firstName} ${lastName}`)
  }

  return Array.from(names)
}

const reviewTemplates = [
  "Bohot acha product hai! Quality excellent hai aur delivery bhi fast thi.",
  "Amazing quality! Highly recommended. Will definitely order again.",
  "Fabric ka quality bohot zabardast hai. Fitting perfect hai.",
  "Outstanding product! Worth every penny. Thank you so much!",
  "Mashallah bohot sundar design hai. Everyone loved it!",
  "Excellent service and product quality. 5 stars deserved!",
  "Bohot khushi hui ye product dekh kar. Bilkul wahi mila jo chahiye tha.",
  "Perfect fit and amazing quality. Delivery was super fast too!",
  "Alhamdulillah bohot acha experience raha. Highly satisfied!",
  "Great product! The material is soft and comfortable to wear.",
  "Zabardast quality hai! Paison ki value for money product.",
  "Loved the design and quality. Will recommend to friends and family.",
  "Bohot acha laga ye product. Quality top notch hai!",
  "Excellent work! The stitching and fabric quality is superb.",
  "Mashallah bohot beautiful product hai. Exactly as shown in pictures.",
  "Amazing experience! Fast delivery and great customer service.",
  "Bohot satisfied hun is purchase se. Quality bilkul perfect hai.",
  "Outstanding quality and design. Will definitely buy more items.",
  "Alhamdulillah bohot acha product mila. Highly recommended!",
  "Perfect product! Great quality and reasonable price.",
]

const additionalComments = [
  "Customer service bhi bohot helpful thi.",
  "Packaging was excellent and secure.",
  "Delivery time was faster than expected.",
  "Material feels premium and durable.",
  "Colors are exactly as shown in pictures.",
  "Size chart was accurate and helpful.",
  "Will definitely recommend to others.",
  "Great value for the price paid.",
  "Quality exceeded my expectations.",
  "Professional service throughout.",
]

const generateUniqueComment = () => {
  const baseComment = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)]

  // 30% chance to add additional comment
  if (Math.random() < 0.3) {
    const additional = additionalComments[Math.floor(Math.random() * additionalComments.length)]
    return `${baseComment} ${additional}`
  }

  return baseComment
}

const getRandomImages = () => {
  if (productImages.length === 0) return []

  const numImages = Math.floor(Math.random() * 3) + 1 // 1-3 images per review
  const selectedImages = []

  for (let i = 0; i < numImages; i++) {
    const randomImage = productImages[Math.floor(Math.random() * productImages.length)]
    if (!selectedImages.includes(randomImage)) {
      selectedImages.push(randomImage)
    }
  }

  return selectedImages
}

const generateOrderNumber = () => {
  return "GG" + Math.floor(Math.random() * 900000000 + 100000000)
}

const generateEmail = (name) => {
  const cleanName = name.toLowerCase().replace(/\s+/g, "")
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  return `${cleanName}${Math.floor(Math.random() * 999)}@${domain}`
}

const getRandomRating = () => {
  // Weighted towards higher ratings (more realistic)
  const weights = [1, 2, 5, 15, 25] // 1-star: 1%, 2-star: 2%, 3-star: 5%, 4-star: 15%, 5-star: 25%
  const random = Math.random() * 48
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random <= sum) {
      return i + 1
    }
  }
  return 5 // Default to 5 stars
}

const seedReviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Get all products
    const products = await Product.find({})
    if (products.length === 0) {
      console.log("No products found. Please seed products first.")
      return
    }

    console.log(`Found ${products.length} products`)

    // Clear existing reviews
    await Review.deleteMany({})
    console.log("Cleared existing reviews")

    const targetReviews = 2500
    const uniqueNames = generateUniqueNames(targetReviews + 100) // Generate extra to ensure uniqueness
    console.log(`Generated ${uniqueNames.length} unique names`)

    const reviews = []
    const usedNames = new Set()

    for (let i = 0; i < targetReviews; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)]

      let randomName
      do {
        randomName = uniqueNames[Math.floor(Math.random() * uniqueNames.length)]
      } while (usedNames.has(randomName))
      usedNames.add(randomName)

      const review = {
        product: randomProduct._id,
        customerName: randomName,
        customerEmail: generateEmail(randomName),
        rating: getRandomRating(),
        comment: generateUniqueComment(), // Use unique comment generator
        images: getRandomImages(), // Add random images from your collection
        isApproved: Math.random() > 0.1, // 90% approved, 10% pending
        orderNumber: generateOrderNumber(),
      }

      reviews.push(review)

      // Show progress every 500 reviews
      if ((i + 1) % 500 === 0) {
        console.log(`Generated ${i + 1} reviews...`)
      }
    }

    // Insert all reviews
    console.log("Inserting reviews into database...")
    await Review.insertMany(reviews)

    console.log("Updating product ratings and review counts...")
    for (const product of products) {
      const productReviews = await Review.find({
        product: product._id,
        isApproved: true,
      })

      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / productReviews.length

        await Product.findByIdAndUpdate(product._id, {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount: productReviews.length,
        })
      }
    }

    console.log(`✅ Successfully created ${targetReviews} sample reviews!`)
    console.log("📊 Review Statistics:")
    console.log(`   - Unique names used: ${usedNames.size}`)
    console.log(
      `   - Images per review: ${productImages.length > 0 ? "1-3 random images" : "No images (add images to productImages array)"}`,
    )

    for (let rating = 1; rating <= 5; rating++) {
      const count = await Review.countDocuments({ rating, isApproved: true })
      console.log(`   - ${rating} Star Reviews: ${count}`)
    }
  } catch (error) {
    console.error("Error seeding reviews:", error)
  } finally {
    await mongoose.connection.close()
    console.log("Database connection closed")
  }
}

// Run the seed function
seedReviews()
