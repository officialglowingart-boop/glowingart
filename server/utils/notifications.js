// const nodemailer = require("nodemailer")
// const twilio = require("twilio")

// // Email transporter
// const transporter = (process.env.EMAIL_HOST && process.env.EMAIL_USER && 
//                     process.env.EMAIL_HOST.trim() && process.env.EMAIL_USER.trim() &&
//                     !process.env.EMAIL_USER.includes('your_email'))
//   ? nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     })
//   : null

// // Twilio client
// const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
//                      process.env.TWILIO_ACCOUNT_SID.trim() && process.env.TWILIO_AUTH_TOKEN.trim() &&
//                      process.env.TWILIO_ACCOUNT_SID.startsWith('AC'))
//   ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
//   : null

// const getEmailTemplate = (type, data) => {
//   const baseStyle = `
//     <style>
//       body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//       .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//       .header { background: linear-gradient(135deg, #d4af37, #f4e4a6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//       .header h1 { color: white; margin: 0; font-size: 2.5rem; font-style: italic; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
//       .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
//       .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none; }
//       .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
//       .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
//       .total-row { font-weight: bold; font-size: 1.2rem; padding-top: 15px; border-top: 2px solid #d4af37; }
//       .btn { display: inline-block; background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
//       .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: bold; }
//       .status-processing { background: #fff3cd; color: #856404; }
//       .status-confirmed { background: #d4edda; color: #155724; }
//       .status-shipped { background: #d1ecf1; color: #0c5460; }
//       .status-delivered { background: #d4edda; color: #155724; }
//       .payment-instructions { background: #e8f4f8; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0; }
//       .warning { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 15px 0; }
//     </style>
//   `

//   const templates = {
//     orderConfirmation: `
//       ${baseStyle}
//       <div class="container">
//         <div class="header">
//           <h1>Glowing Gallery</h1>
//           <p style="color: white; margin: 10px 0 0; font-size: 1.2rem;">Order Confirmation</p>
//         </div>
//         <div class="content">
//           <h2 style="color: #d4af37;">Thank you for your order, ${data.order.customerInfo.firstName}!</h2>
//           <p>Your order has been successfully placed and is being processed. We'll send you updates as your order progresses.</p>
          
//           <div class="order-details">
//             <h3 style="margin-top: 0; color: #333;">Order Details</h3>
//             <div class="item-row">
//               <span><strong>Order Number:</strong></span>
//               <span>${data.order.orderNumber}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>Order Date:</strong></span>
//               <span>${new Date(data.order.createdAt).toLocaleDateString()}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>Payment Method:</strong></span>
//               <span>${data.order.paymentMethod}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>Status:</strong></span>
//               <span class="status-badge status-processing">Processing</span>
//             </div>
//           </div>

//           <div class="order-details">
//             <h3 style="margin-top: 0; color: #333;">Items Ordered</h3>
//             ${data.order.items
//               .map(
//                 (item) => `
//               <div class="item-row">
//                 <div>
//                   <strong>${item.productName}</strong><br>
//                   <small>Size: ${item.size} • Quantity: ${item.quantity}</small>
//                 </div>
//                 <div style="text-align: right;">
//                   <strong>Rs.${(item.price * item.quantity).toLocaleString()}</strong><br>
//                   <small>Rs.${item.price.toLocaleString()} each</small>
//                 </div>
//               </div>
//             `,
//               )
//               .join("")}
            
//             <div class="item-row">
//               <span>Subtotal:</span>
//               <span>Rs.${data.order.subtotal.toLocaleString()}</span>
//             </div>
//             ${
//               data.order.shippingProtection.enabled
//                 ? `
//               <div class="item-row">
//                 <span>Shipping Protection:</span>
//                 <span>Rs.${data.order.shippingProtection.cost.toLocaleString()}</span>
//               </div>
//             `
//                 : ""
//             }
//             ${
//               data.order.discountCode.discount > 0
//                 ? `
//               <div class="item-row" style="color: #28a745;">
//                 <span>Discount (${data.order.discountCode.code}):</span>
//                 <span>-Rs.${data.order.discountCode.discount.toLocaleString()}</span>
//               </div>
//             `
//                 : ""
//             }
//             <div class="item-row total-row">
//               <span>Total Amount:</span>
//               <span>Rs.${data.order.total.toLocaleString()}</span>
//             </div>
//           </div>

//           <div class="order-details">
//             <h3 style="margin-top: 0; color: #333;">Shipping Address</h3>
//             <p style="margin: 0;">
//               ${data.order.customerInfo.firstName} ${data.order.customerInfo.lastName}<br>
//               ${data.order.customerInfo.address}<br>
//               ${data.order.customerInfo.city}, ${data.order.customerInfo.postalCode}<br>
//               ${data.order.customerInfo.country}<br>
//               Phone: ${data.order.customerInfo.phone}
//             </p>
//           </div>

//           ${
//             data.paymentInstructions
//               ? `
//             <div class="payment-instructions">
//               <h3 style="margin-top: 0; color: #17a2b8;">Payment Instructions</h3>
//               <p><strong>${data.paymentInstructions.title}</strong></p>
//               <ol>
//                 ${data.paymentInstructions.steps.map((step) => `<li>${step}</li>`).join("")}
//               </ol>
//               ${
//                 data.paymentInstructions.accountDetails
//                   ? `
//                 <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
//                   <h4 style="margin-top: 0;">Account Details:</h4>
//                   ${Object.entries(data.paymentInstructions.accountDetails)
//                     .map(
//                       ([key, value]) =>
//                         `<p style="margin: 5px 0;"><strong>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong> ${value}</p>`,
//                     )
//                     .join("")}
//                 </div>
//               `
//                   : ""
//               }
//             </div>
//           `
//               : ""
//           }

//           <div class="warning">
//             <strong>Important:</strong> Please keep your order number (${data.order.orderNumber}) for tracking and customer service inquiries.
//           </div>

//           <p style="text-align: center;">
//             <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}" class="btn">Track Your Order</a>
//           </p>
//         </div>
//         <div class="footer">
//           <p><strong>Questions?</strong> Contact us at ${process.env.EMAIL_USER} or WhatsApp: +92-XXX-XXXXXXX</p>
//           <p style="color: #666; font-size: 0.9rem;">Thank you for choosing Glowing Gallery!</p>
//         </div>
//       </div>
//     `,

//     statusUpdate: `
//       ${baseStyle}
//       <div class="container">
//         <div class="header">
//           <h1>Glowing Gallery</h1>
//           <p style="color: white; margin: 10px 0 0; font-size: 1.2rem;">Order Update</p>
//         </div>
//         <div class="content">
//           <h2 style="color: #d4af37;">Order Status Update</h2>
//           <p>Hello ${data.order.customerInfo.firstName}, your order status has been updated!</p>
          
//           <div class="order-details">
//             <div class="item-row">
//               <span><strong>Order Number:</strong></span>
//               <span>${data.order.orderNumber}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>New Status:</strong></span>
//               <span class="status-badge status-${data.order.orderStatus}">${data.order.orderStatus.charAt(0).toUpperCase() + data.order.orderStatus.slice(1)}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>Payment Status:</strong></span>
//               <span>${data.order.paymentStatus.charAt(0).toUpperCase() + data.order.paymentStatus.slice(1)}</span>
//             </div>
//             ${
//               data.order.notes
//                 ? `
//               <div style="margin-top: 15px;">
//                 <strong>Notes:</strong>
//                 <p style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 5px 0;">${data.order.notes}</p>
//               </div>
//             `
//                 : ""
//             }
//           </div>

//           ${
//             data.order.orderStatus === "shipped"
//               ? `
//             <div class="payment-instructions">
//               <h3 style="margin-top: 0; color: #17a2b8;">Shipping Information</h3>
//               <p>Your order is on its way! Expected delivery: 3-5 business days.</p>
//               <p>You'll receive another notification when your order is delivered.</p>
//             </div>
//           `
//               : ""
//           }

//           ${
//             data.order.orderStatus === "delivered"
//               ? `
//             <div style="background: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
//               <h3 style="margin-top: 0; color: #155724;">Order Delivered!</h3>
//               <p style="color: #155724; margin: 0;">Your order has been successfully delivered. We hope you love your new artwork!</p>
//             </div>
//           `
//               : ""
//           }

//           <p style="text-align: center;">
//             <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}" class="btn">Track Your Order</a>
//           </p>
//         </div>
//         <div class="footer">
//           <p>Thank you for choosing Glowing Gallery!</p>
//         </div>
//       </div>
//     `,

//     paymentReminder: `
//       ${baseStyle}
//       <div class="container">
//         <div class="header">
//           <h1>Glowing Gallery</h1>
//           <p style="color: white; margin: 10px 0 0; font-size: 1.2rem;">Payment Reminder</p>
//         </div>
//         <div class="content">
//           <h2 style="color: #d4af37;">Payment Pending</h2>
//           <p>Hello ${data.order.customerInfo.firstName}, we're waiting for your payment to process your order.</p>
          
//           <div class="order-details">
//             <div class="item-row">
//               <span><strong>Order Number:</strong></span>
//               <span>${data.order.orderNumber}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>Amount Due:</strong></span>
//               <span style="color: #d4af37; font-size: 1.2rem; font-weight: bold;">Rs.${data.order.total.toLocaleString()}</span>
//             </div>
//             <div class="item-row">
//               <span><strong>Payment Method:</strong></span>
//               <span>${data.order.paymentMethod}</span>
//             </div>
//           </div>

//           ${
//             data.paymentInstructions
//               ? `
//             <div class="payment-instructions">
//               <h3 style="margin-top: 0; color: #17a2b8;">${data.paymentInstructions.title}</h3>
//               <ol>
//                 ${data.paymentInstructions.steps.map((step) => `<li>${step}</li>`).join("")}
//               </ol>
//             </div>
//           `
//               : ""
//           }

//           <div class="warning">
//             <strong>Note:</strong> Orders are held for 48 hours pending payment. Please complete your payment to avoid cancellation.
//           </div>
//         </div>
//         <div class="footer">
//           <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
//         </div>
//       </div>
//     `,
//   }

//   return templates[type] || templates.orderConfirmation
// }

// const getWhatsAppMessage = (type, data) => {
//   const messages = {
//     orderConfirmation: `🎨 *GLOWING GALLERY* 🎨

// ✅ *Order Confirmed!*

// Hello ${data.order.customerInfo.firstName}! Your order has been successfully placed.

// 📋 *Order Details:*
// • Order #: *${data.order.orderNumber}*
// • Total: *Rs.${data.order.total.toLocaleString()}*
// • Payment: *${data.order.paymentMethod}*
// • Items: ${data.order.items.length} item(s)

// 📦 *Items Ordered:*
// ${data.order.items.map((item) => `• ${item.productName} (${item.size}) x${item.quantity}`).join("\n")}

// 📍 *Shipping to:*
// ${data.order.customerInfo.address}
// ${data.order.customerInfo.city}, ${data.order.customerInfo.postalCode}

// ${
//   data.order.paymentMethod !== "COD"
//     ? `💳 *Payment Instructions:*
// Please check your email for detailed payment instructions.

// ⏰ *Important:* Complete payment within 48 hours to avoid order cancellation.`
//     : `💰 *Cash on Delivery*
// Pay when you receive your order. COD fee may apply.`
// }

// 🔍 Track your order: ${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}

// Thank you for choosing Glowing Gallery! ✨`,

//     statusUpdate: `🎨 *GLOWING GALLERY* 🎨

// 📦 *Order Update*

// Hello ${data.order.customerInfo.firstName}!

// Your order *${data.order.orderNumber}* status has been updated:

// ${data.order.orderStatus === "confirmed" ? "✅ *CONFIRMED* - Your order is confirmed and being prepared!" : ""}
// ${data.order.orderStatus === "shipped" ? "🚚 *SHIPPED* - Your order is on the way! Expected delivery: 3-5 days." : ""}
// ${data.order.orderStatus === "delivered" ? "🎉 *DELIVERED* - Your order has been delivered! Enjoy your new artwork!" : ""}
// ${data.order.orderStatus === "cancelled" ? "❌ *CANCELLED* - Your order has been cancelled. Refund will be processed if payment was made." : ""}

// ${data.order.notes ? `📝 *Notes:* ${data.order.notes}` : ""}

// 🔍 Track: ${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}

// Questions? Reply to this message! 💬`,

//     paymentReminder: `🎨 *GLOWING GALLERY* 🎨

// ⏰ *Payment Reminder*

// Hello ${data.order.customerInfo.firstName}!

// Your order *${data.order.orderNumber}* is waiting for payment:

// 💰 *Amount Due:* Rs.${data.order.total.toLocaleString()}
// 💳 *Method:* ${data.order.paymentMethod}

// ${data.order.paymentMethod === "JazzCash" ? "📱 *JazzCash:* Send money to 03XX-XXXXXXX" : ""}
// ${data.order.paymentMethod === "Easypaisa" ? "📱 *Easypaisa:* Send money to 03XX-XXXXXXX" : ""}
// ${data.order.paymentMethod === "Bank Transfer" ? "🏦 *Bank Transfer:* Check email for account details" : ""}
// ${data.order.paymentMethod === "Crypto" ? "₿ *Crypto:* Check email for wallet addresses" : ""}

// ⚠️ *Important:* Complete payment within 48 hours to avoid cancellation.

// 📧 Check your email for detailed instructions!

// Need help? Reply to this message! 💬`,

//     paymentConfirmed: `🎨 *GLOWING GALLERY* 🎨

// ✅ *Payment Confirmed!*

// Hello ${data.order.customerInfo.firstName}!

// Your payment for order *${data.order.orderNumber}* has been confirmed!

// 💰 *Amount:* Rs.${data.order.total.toLocaleString()}
// 📦 *Status:* Order is now being prepared for shipping

// 🚚 *Next Steps:*
// • Your order will be prepared within 1-2 business days
// • You'll receive shipping confirmation with tracking details
// • Expected delivery: 3-5 business days

// 🔍 Track: ${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}

// Thank you for your business! ✨`,
//   }

//   return messages[type] || messages.orderConfirmation
// }

// const sendOrderConfirmation = async (order) => {
//   try {
//     // Generate payment instructions if not COD
//     let paymentInstructions = null
//     if (order.paymentMethod !== "COD") {
//       paymentInstructions = generatePaymentInstructions(order.paymentMethod, order)
//     }

//     const emailData = { order, paymentInstructions }
//     const whatsappData = { order }

//     await Promise.all([
//       sendEmail("orderConfirmation", order.customerInfo.email, `Order Confirmation - ${order.orderNumber}`, emailData),
//       sendWhatsApp("orderConfirmation", order.customerInfo.phone, whatsappData),
//     ])

//     console.log(`Order confirmation sent for ${order.orderNumber}`)
//   } catch (error) {
//     console.error("Order confirmation error:", error)
//     throw error
//   }
// }

// const sendStatusUpdate = async (order) => {
//   try {
//     const emailData = { order }
//     const whatsappData = { order }

//     await Promise.all([
//       sendEmail("statusUpdate", order.customerInfo.email, `Order Update - ${order.orderNumber}`, emailData),
//       sendWhatsApp("statusUpdate", order.customerInfo.phone, whatsappData),
//     ])

//     console.log(`Status update sent for ${order.orderNumber}`)
//   } catch (error) {
//     console.error("Status update error:", error)
//     throw error
//   }
// }

// const sendPaymentReminder = async (order) => {
//   try {
//     const paymentInstructions = generatePaymentInstructions(order.paymentMethod, order)
//     const emailData = { order, paymentInstructions }
//     const whatsappData = { order }

//     await Promise.all([
//       sendEmail("paymentReminder", order.customerInfo.email, `Payment Reminder - ${order.orderNumber}`, emailData),
//       sendWhatsApp("paymentReminder", order.customerInfo.phone, whatsappData),
//     ])

//     console.log(`Payment reminder sent for ${order.orderNumber}`)
//   } catch (error) {
//     console.error("Payment reminder error:", error)
//     throw error
//   }
// }

// const sendPaymentConfirmation = async (order) => {
//   try {
//     const emailData = { order }
//     const whatsappData = { order }

//     await Promise.all([
//       sendEmail("statusUpdate", order.customerInfo.email, `Payment Confirmed - ${order.orderNumber}`, emailData),
//       sendWhatsApp("paymentConfirmed", order.customerInfo.phone, whatsappData),
//     ])

//     console.log(`Payment confirmation sent for ${order.orderNumber}`)
//   } catch (error) {
//     console.error("Payment confirmation error:", error)
//     throw error
//   }
// }

// const generatePaymentInstructions = (paymentMethod, order) => {
//   const instructions = {
//     JazzCash: {
//       title: "JazzCash Payment Instructions",
//       steps: [
//         "Open your JazzCash mobile app",
//         "Select 'Send Money' or 'Money Transfer'",
//         `Send Rs.${order.total.toLocaleString()} to: 03XX-XXXXXXX`,
//         `Use reference: ${order.orderNumber}`,
//         "Take a screenshot of the transaction",
//         "Send the screenshot to our WhatsApp: +92-XXX-XXXXXXX",
//       ],
//       accountDetails: {
//         accountTitle: "Glowing Gallery",
//         accountNumber: "03XX-XXXXXXX",
//         reference: order.orderNumber,
//       },
//     },
//     Easypaisa: {
//       title: "Easypaisa Payment Instructions",
//       steps: [
//         "Open your Easypaisa mobile app",
//         "Select 'Send Money'",
//         `Send Rs.${order.total.toLocaleString()} to: 03XX-XXXXXXX`,
//         `Use reference: ${order.orderNumber}`,
//         "Take a screenshot of the transaction",
//         "Send the screenshot to our WhatsApp: +92-XXX-XXXXXXX",
//       ],
//       accountDetails: {
//         accountTitle: "Glowing Gallery",
//         accountNumber: "03XX-XXXXXXX",
//         reference: order.orderNumber,
//       },
//     },
//     "Bank Transfer": {
//       title: "Bank Transfer Instructions",
//       steps: [
//         "Visit your bank or use online banking",
//         "Transfer the exact amount to our account",
//         `Amount: Rs.${order.total.toLocaleString()}`,
//         `Reference: ${order.orderNumber}`,
//         "Keep the transaction receipt",
//         "Send receipt photo to our WhatsApp: +92-XXX-XXXXXXX",
//       ],
//       accountDetails: {
//         bankName: "HBL Bank",
//         accountTitle: "Glowing Gallery",
//         accountNumber: "XXXX-XXXX-XXXX-XXXX",
//         iban: "PK36HABB0000000000000000",
//         reference: order.orderNumber,
//       },
//     },
//     Crypto: {
//       title: "Cryptocurrency Payment Instructions",
//       steps: [
//         "Choose your preferred cryptocurrency",
//         `Send exact amount equivalent to Rs.${order.total.toLocaleString()}`,
//         "Use the wallet address provided below",
//         `Include reference: ${order.orderNumber}`,
//         "Send transaction hash to our WhatsApp",
//         "Payment will be confirmed within 1 hour",
//       ],
//       walletAddresses: {
//         bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
//         ethereum: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b5b",
//         usdt: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oREqjK",
//         reference: order.orderNumber,
//       },
//     },
//   }

//   return instructions[paymentMethod] || null
// }

// const sendEmail = async (type, to, subject, data) => {
//   if (!transporter) {
//     console.log("Email transporter not configured, skipping email notification")
//     return
//   }

//   const htmlContent = getEmailTemplate(type, data)

//   const mailOptions = {
//     from: `"Glowing Gallery" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html: htmlContent,
//   }

//   await transporter.sendMail(mailOptions)
// }

// const sendWhatsApp = async (type, phone, data) => {
//   if (!twilioClient) {
//     console.log("Twilio not configured, skipping WhatsApp notification")
//     return
//   }

//   const message = getWhatsAppMessage(type, data)

//   // Format phone number for WhatsApp
//   const formattedPhone = phone.startsWith("+") ? `whatsapp:${phone}` : `whatsapp:+${phone}`

//   await twilioClient.messages.create({
//     from: process.env.TWILIO_WHATSAPP_NUMBER,
//     to: formattedPhone,
//     body: message,
//   })
// }

// const sendOrderConfirmationEmail = async (order) => {
//   const paymentInstructions =
//     order.paymentMethod !== "COD" ? generatePaymentInstructions(order.paymentMethod, order) : null
//   await sendEmail("orderConfirmation", order.customerInfo.email, `Order Confirmation - ${order.orderNumber}`, {
//     order,
//     paymentInstructions,
//   })
// }

// const sendWhatsAppNotification = async (order) => {
//   await sendWhatsApp("orderConfirmation", order.customerInfo.phone, { order })
// }

// const sendPaymentInstructions = async (order, type = "reminder") => {
//   if (type === "confirmed") {
//     await sendPaymentConfirmation(order)
//   } else {
//     await sendPaymentReminder(order)
//   }
// }

// module.exports = {
//   sendOrderConfirmation,
//   sendStatusUpdate,
//   sendPaymentReminder,
//   sendPaymentConfirmation,
//   sendPaymentInstructions,
//   sendOrderConfirmationEmail,
//   sendWhatsAppNotification,
//   sendEmail,
//   sendWhatsApp,
// }












































































const nodemailer = require("nodemailer")
const twilio = require("twilio")

const transporter =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_HOST.trim() &&
  process.env.EMAIL_USER.trim() &&
  process.env.EMAIL_PASS.trim() &&
  !process.env.EMAIL_USER.includes("your_email") &&
  !process.env.EMAIL_PASS.includes("your_app_password")
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // smtp.zoho.com for Zoho Mail
        port: Number.parseInt(process.env.EMAIL_PORT) || 587, // Ensure port is a number
        secure: false, // Use STARTTLS for port 587
        auth: {
          user: process.env.EMAIL_USER, // Your Zoho email address
          pass: process.env.EMAIL_PASS, // Your Zoho app password
        },
        tls: {
          rejectUnauthorized: false, // Accept self-signed certificates if needed
          ciphers: "SSLv3", // Additional compatibility for Zoho
        },
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000, // 30 seconds
        socketTimeout: 60000, // 60 seconds
      })
    : null

if (!transporter) {
  console.log("❌ Email transporter not configured. Missing environment variables:")
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST ? "✅ Set" : "❌ Missing"}`)
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? "✅ Set" : "❌ Missing"}`)
  console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing"}`)
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || "587 (default)"}`)

  if (process.env.EMAIL_USER && process.env.EMAIL_USER.includes("your_email")) {
    console.log("   ⚠️  EMAIL_USER contains placeholder text - please update with your actual Zoho email")
  }
  if (process.env.EMAIL_PASS && process.env.EMAIL_PASS.includes("your_app_password")) {
    console.log("   ⚠️  EMAIL_PASS contains placeholder text - please update with your Zoho app password")
  }
} else {
  console.log("✅ Email transporter configured successfully")
}

// Twilio client
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_ACCOUNT_SID.trim() &&
  process.env.TWILIO_AUTH_TOKEN.trim() &&
  process.env.TWILIO_ACCOUNT_SID.startsWith("AC")
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

const getEmailTemplate = (type, data) => {
  const baseStyle = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #d4af37, #f4e4a6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .header h1 { color: white; margin: 0; font-size: 2.5rem; font-style: italic; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
      .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
      .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none; }
      .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
      .total-row { font-weight: bold; font-size: 1.2rem; padding-top: 15px; border-top: 2px solid #d4af37; }
      .btn { display: inline-block; background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
      .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: bold; }
      .status-processing { background: #fff3cd; color: #856404; }
      .status-confirmed { background: #d4edda; color: #155724; }
      .status-shipped { background: #d1ecf1; color: #0c5460; }
      .status-delivered { background: #d4edda; color: #155724; }
      .payment-instructions { background: #e8f4f8; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0; }
      .warning { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 15px 0; }
    </style>
  `

  const templates = {
    orderConfirmation: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>Glowing Gallery</h1>
          <p style="color: white; margin: 10px 0 0; font-size: 1.2rem;">Order Confirmation</p>
        </div>
        <div class="content">
          <h2 style="color: #d4af37;">Thank you for your order, ${data.order.customerInfo.firstName}!</h2>
          <p>Your order has been successfully placed and is being processed. We'll send you updates as your order progresses.</p>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #333;">Order Details</h3>
            <div class="item-row">
              <span><strong>Order Number:</strong></span>
              <span>${data.order.orderNumber}</span>
            </div>
            <div class="item-row">
              <span><strong>Order Date:</strong></span>
              <span>${new Date(data.order.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="item-row">
              <span><strong>Payment Method:</strong></span>
              <span>${data.order.paymentMethod}</span>
            </div>
            <div class="item-row">
              <span><strong>Status:</strong></span>
              <span class="status-badge status-processing">Processing</span>
            </div>
          </div>

          <div class="order-details">
            <h3 style="margin-top: 0; color: #333;">Items Ordered</h3>
            ${data.order.items
              .map(
                (item) => `
              <div class="item-row">
                <div>
                  <strong>${item.productName}</strong><br>
                  <small>Size: ${item.size} • Quantity: ${item.quantity}</small>
                </div>
                <div style="text-align: right;">
                  <strong>Rs.${(item.price * item.quantity).toLocaleString()}</strong><br>
                  <small>Rs.${item.price.toLocaleString()} each</small>
                </div>
              </div>
            `,
              )
              .join("")}
            
            <div class="item-row">
              <span>Subtotal:</span>
              <span>Rs.${data.order.subtotal.toLocaleString()}</span>
            </div>
            ${
              data.order.shippingProtection.enabled
                ? `
              <div class="item-row">
                <span>Shipping Protection:</span>
                <span>Rs.${data.order.shippingProtection.cost.toLocaleString()}</span>
              </div>
            `
                : ""
            }
            ${
              data.order.discountCode.discount > 0
                ? `
              <div class="item-row" style="color: #28a745;">
                <span>Discount (${data.order.discountCode.code}):</span>
                <span>-Rs.${data.order.discountCode.discount.toLocaleString()}</span>
              </div>
            `
                : ""
            }
            <div class="item-row total-row">
              <span>Total Amount:</span>
              <span>Rs.${data.order.total.toLocaleString()}</span>
            </div>
          </div>

          <div class="order-details">
            <h3 style="margin-top: 0; color: #333;">Shipping Address</h3>
            <p style="margin: 0;">
              ${data.order.customerInfo.firstName} ${data.order.customerInfo.lastName}<br>
              ${data.order.customerInfo.address}<br>
              ${data.order.customerInfo.city}, ${data.order.customerInfo.postalCode}<br>
              ${data.order.customerInfo.country}<br>
              Phone: ${data.order.customerInfo.phone}
            </p>
          </div>

          ${
            data.paymentInstructions
              ? `
            <div class="payment-instructions">
              <h3 style="margin-top: 0; color: #17a2b8;">Payment Instructions</h3>
              <p><strong>${data.paymentInstructions.title}</strong></p>
              <ol>
                ${data.paymentInstructions.steps.map((step) => `<li>${step}</li>`).join("")}
              </ol>
              ${
                data.paymentInstructions.accountDetails
                  ? `
                <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
                  <h4 style="margin-top: 0;">Account Details:</h4>
                  ${Object.entries(data.paymentInstructions.accountDetails)
                    .map(
                      ([key, value]) =>
                        `<p style="margin: 5px 0;"><strong>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong> ${value}</p>`,
                    )
                    .join("")}
                </div>
              `
                  : ""
              }
            </div>
          `
              : ""
          }

          <div class="warning">
            <strong>Important:</strong> Please keep your order number (${data.order.orderNumber}) for tracking and customer service inquiries.
          </div>

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}" class="btn">Track Your Order</a>
          </p>
        </div>
        <div class="footer">
          <p><strong>Questions?</strong> Contact us at ${process.env.EMAIL_USER} or WhatsApp: +92-XXX-XXXXXXX</p>
          <p style="color: #666; font-size: 0.9rem;">Thank you for choosing Glowing Gallery!</p>
        </div>
      </div>
    `,

    statusUpdate: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>Glowing Gallery</h1>
          <p style="color: white; margin: 10px 0 0; font-size: 1.2rem;">Order Update</p>
        </div>
        <div class="content">
          <h2 style="color: #d4af37;">Order Status Update</h2>
          <p>Hello ${data.order.customerInfo.firstName}, your order status has been updated!</p>
          
          <div class="order-details">
            <div class="item-row">
              <span><strong>Order Number:</strong></span>
              <span>${data.order.orderNumber}</span>
            </div>
            <div class="item-row">
              <span><strong>New Status:</strong></span>
              <span class="status-badge status-${data.order.orderStatus}">${data.order.orderStatus.charAt(0).toUpperCase() + data.order.orderStatus.slice(1)}</span>
            </div>
            <div class="item-row">
              <span><strong>Payment Status:</strong></span>
              <span>${data.order.paymentStatus.charAt(0).toUpperCase() + data.order.paymentStatus.slice(1)}</span>
            </div>
            ${
              data.order.notes
                ? `
              <div style="margin-top: 15px;">
                <strong>Notes:</strong>
                <p style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 5px 0;">${data.order.notes}</p>
              </div>
            `
                : ""
            }
          </div>

          ${
            data.order.orderStatus === "shipped"
              ? `
            <div class="payment-instructions">
              <h3 style="margin-top: 0; color: #17a2b8;">Shipping Information</h3>
              <p>Your order is on its way! Expected delivery: 3-5 business days.</p>
              <p>You'll receive another notification when your order is delivered.</p>
            </div>
          `
              : ""
          }

          ${
            data.order.orderStatus === "delivered"
              ? `
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #155724;">Order Delivered!</h3>
              <p style="color: #155724; margin: 0;">Your order has been successfully delivered. We hope you love your new artwork!</p>
            </div>
          `
              : ""
          }

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}" class="btn">Track Your Order</a>
          </p>
        </div>
        <div class="footer">
          <p>Thank you for choosing Glowing Gallery!</p>
        </div>
      </div>
    `,

    paymentReminder: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>Glowing Gallery</h1>
          <p style="color: white; margin: 10px 0 0; font-size: 1.2rem;">Payment Reminder</p>
        </div>
        <div class="content">
          <h2 style="color: #d4af37;">Payment Pending</h2>
          <p>Hello ${data.order.customerInfo.firstName}, we're waiting for your payment to process your order.</p>
          
          <div class="order-details">
            <div class="item-row">
              <span><strong>Order Number:</strong></span>
              <span>${data.order.orderNumber}</span>
            </div>
            <div class="item-row">
              <span><strong>Amount Due:</strong></span>
              <span style="color: #d4af37; font-size: 1.2rem; font-weight: bold;">Rs.${data.order.total.toLocaleString()}</span>
            </div>
            <div class="item-row">
              <span><strong>Payment Method:</strong></span>
              <span>${data.order.paymentMethod}</span>
            </div>
          </div>

          ${
            data.paymentInstructions
              ? `
            <div class="payment-instructions">
              <h3 style="margin-top: 0; color: #17a2b8;">${data.paymentInstructions.title}</h3>
              <ol>
                ${data.paymentInstructions.steps.map((step) => `<li>${step}</li>`).join("")}
              </ol>
            </div>
          `
              : ""
          }

          <div class="warning">
            <strong>Note:</strong> Orders are held for 48 hours pending payment. Please complete your payment to avoid cancellation.
          </div>
        </div>
        <div class="footer">
          <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
        </div>
      </div>
    `,
  }

  return templates[type] || templates.orderConfirmation
}

const getWhatsAppMessage = (type, data) => {
  const messages = {
    orderConfirmation: `🎨 *GLOWING GALLERY* 🎨

✅ *Order Confirmed!*

Hello ${data.order.customerInfo.firstName}! Your order has been successfully placed.

📋 *Order Details:*
• Order #: *${data.order.orderNumber}*
• Total: *Rs.${data.order.total.toLocaleString()}*
• Payment: *${data.order.paymentMethod}*
• Items: ${data.order.items.length} item(s)

📦 *Items Ordered:*
${data.order.items.map((item) => `• ${item.productName} (${item.size}) x${item.quantity}`).join("\n")}

📍 *Shipping to:*
${data.order.customerInfo.address}
${data.order.customerInfo.city}, ${data.order.customerInfo.postalCode}

${
  data.order.paymentMethod !== "COD"
    ? `💳 *Payment Instructions:*
Please check your email for detailed payment instructions.

⏰ *Important:* Complete payment within 48 hours to avoid order cancellation.`
    : `💰 *Cash on Delivery*
Pay when you receive your order. COD fee may apply.`
}

🔍 Track your order: ${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}

Thank you for choosing Glowing Gallery! ✨`,

    statusUpdate: `🎨 *GLOWING GALLERY* 🎨

📦 *Order Update*

Hello ${data.order.customerInfo.firstName}!

Your order *${data.order.orderNumber}* status has been updated:

${data.order.orderStatus === "confirmed" ? "✅ *CONFIRMED* - Your order is confirmed and being prepared!" : ""}
${data.order.orderStatus === "shipped" ? "🚚 *SHIPPED* - Your order is on the way! Expected delivery: 3-5 days." : ""}
${data.order.orderStatus === "delivered" ? "🎉 *DELIVERED* - Your order has been delivered! Enjoy your new artwork!" : ""}
${data.order.orderStatus === "cancelled" ? "❌ *CANCELLED* - Your order has been cancelled. Refund will be processed if payment was made." : ""}

${data.order.notes ? `📝 *Notes:* ${data.order.notes}` : ""}

🔍 Track: ${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}

Questions? Reply to this message! 💬`,

    paymentReminder: `🎨 *GLOWING GALLERY* 🎨

⏰ *Payment Reminder*

Hello ${data.order.customerInfo.firstName}!

Your order *${data.order.orderNumber}* is waiting for payment:

💰 *Amount Due:* Rs.${data.order.total.toLocaleString()}
💳 *Method:* ${data.order.paymentMethod}

${data.order.paymentMethod === "JazzCash" ? "📱 *JazzCash:* Send money to 03XX-XXXXXXX" : ""}
${data.order.paymentMethod === "Easypaisa" ? "📱 *Easypaisa:* Send money to 03XX-XXXXXXX" : ""}
${data.order.paymentMethod === "Bank Transfer" ? "🏦 *Bank Transfer:* Check email for account details" : ""}
${data.order.paymentMethod === "Crypto" ? "₿ *Crypto:* Check email for wallet addresses" : ""}

⚠️ *Important:* Complete payment within 48 hours to avoid cancellation.

📧 Check your email for detailed instructions!

Need help? Reply to this message! 💬`,

    paymentConfirmed: `🎨 *GLOWING GALLERY* 🎨

✅ *Payment Confirmed!*

Hello ${data.order.customerInfo.firstName}!

Your payment for order *${data.order.orderNumber}* has been confirmed!

💰 *Amount:* Rs.${data.order.total.toLocaleString()}
📦 *Status:* Order is now being prepared for shipping

🚚 *Next Steps:*
• Your order will be prepared within 1-2 business days
• You'll receive shipping confirmation with tracking details
• Expected delivery: 3-5 business days

🔍 Track: ${process.env.FRONTEND_URL || "http://localhost:3000"}/track/${data.order.orderNumber}

Thank you for your business! ✨`,
  }

  return messages[type] || messages.orderConfirmation
}

const sendOrderConfirmation = async (order) => {
  try {
    // Generate payment instructions if not COD
    let paymentInstructions = null
    if (order.paymentMethod !== "COD") {
      paymentInstructions = generatePaymentInstructions(order.paymentMethod, order)
    }

    const emailData = { order, paymentInstructions }
    const whatsappData = { order }

    await Promise.all([
      sendEmail("orderConfirmation", order.customerInfo.email, `Order Confirmation - ${order.orderNumber}`, emailData),
      sendWhatsApp("orderConfirmation", order.customerInfo.phone, whatsappData),
    ])

    console.log(`Order confirmation sent for ${order.orderNumber}`)
  } catch (error) {
    console.error("Order confirmation error:", error)
    throw error
  }
}

const sendStatusUpdate = async (order) => {
  try {
    const emailData = { order }
    const whatsappData = { order }

    await Promise.all([
      sendEmail("statusUpdate", order.customerInfo.email, `Order Update - ${order.orderNumber}`, emailData),
      sendWhatsApp("statusUpdate", order.customerInfo.phone, whatsappData),
    ])

    console.log(`Status update sent for ${order.orderNumber}`)
  } catch (error) {
    console.error("Status update error:", error)
    throw error
  }
}

const sendPaymentReminder = async (order) => {
  try {
    // Per requirement: do NOT send payment reminder emails.
    // Keep WhatsApp reminder only.
    const paymentInstructions = generatePaymentInstructions(order.paymentMethod, order)
    const whatsappData = { order, paymentInstructions }

    await sendWhatsApp("paymentReminder", order.customerInfo.phone, whatsappData)

    console.log(`Payment reminder (WhatsApp only) sent for ${order.orderNumber}`)
  } catch (error) {
    console.error("Payment reminder error:", error)
    throw error
  }
}

const sendPaymentConfirmation = async (order) => {
  try {
    const emailData = { order }
    const whatsappData = { order }

    await Promise.all([
      sendEmail("statusUpdate", order.customerInfo.email, `Payment Confirmed - ${order.orderNumber}`, emailData),
      sendWhatsApp("paymentConfirmed", order.customerInfo.phone, whatsappData),
    ])

    console.log(`Payment confirmation sent for ${order.orderNumber}`)
  } catch (error) {
    console.error("Payment confirmation error:", error)
    throw error
  }
}

const generatePaymentInstructions = (paymentMethod, order) => {
  // Normalize payment method coming from client (mobile/desktop may differ slightly)
  const method = String(paymentMethod || "").trim().toLowerCase()

  // Master instruction set (lowercase keys)
  const instructions = {
    jazzcash: {
      title: "JazzCash Payment Instructions",
      steps: [
        "Open your JazzCash mobile app",
        "Select 'Send Money' or 'Money Transfer'",
        `Send Rs.${order.total.toLocaleString()} to: 03XX-XXXXXXX`,
        `Use reference: ${order.orderNumber}`,
        "Take a screenshot of the transaction",
        "Send the screenshot to our WhatsApp: +92-XXX-XXXXXXX",
      ],
      accountDetails: {
        accountTitle: "Glowing Gallery",
        accountNumber: "03XX-XXXXXXX",
        reference: order.orderNumber,
      },
    },
    easypaisa: {
      title: "Easypaisa Payment Instructions",
      steps: [
        "Open your Easypaisa mobile app",
        "Select 'Send Money'",
        `Send Rs.${order.total.toLocaleString()} to: 03XX-XXXXXXX`,
        `Use reference: ${order.orderNumber}`,
        "Take a screenshot of the transaction",
        "Send the screenshot to our WhatsApp: +92-XXX-XXXXXXX",
      ],
      accountDetails: {
        accountTitle: "Glowing Gallery",
        accountNumber: "03XX-XXXXXXX",
        reference: order.orderNumber,
      },
    },
    "bank transfer": {
      title: "Bank Transfer Instructions",
      steps: [
        "Visit your bank or use online banking",
        "Transfer the exact amount to our account",
        `Amount: Rs.${order.total.toLocaleString()}`,
        `Reference: ${order.orderNumber}`,
        "Keep the transaction receipt",
        "Send receipt photo to our WhatsApp: +92-XXX-XXXXXXX",
      ],
      accountDetails: {
        bankName: "HBL Bank",
        accountTitle: "Glowing Gallery",
        accountNumber: "XXXX-XXXX-XXXX-XXXX",
        iban: "PK36HABB0000000000000000",
        reference: order.orderNumber,
      },
    },
    crypto: {
      title: "Cryptocurrency Payment Instructions",
      steps: [
        "Choose your preferred cryptocurrency",
        `Send exact amount equivalent to Rs.${order.total.toLocaleString()}`,
        "Use the wallet address provided below",
        `Include reference: ${order.orderNumber}`,
        "Send transaction hash to our WhatsApp",
        "Payment will be confirmed within 1 hour",
      ],
      walletAddresses: {
        bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        ethereum: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b5b",
        usdt: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oREqjK",
        reference: order.orderNumber,
      },
    },
    // Explicit USDT tab from mobile/desktop UI
    "usdt (trc-20)": {
      title: "USDT (TRC-20) Payment Instructions",
      steps: [
        "Open your crypto wallet/exchange",
        `Send exact USDT equivalent of Rs.${order.total.toLocaleString()} (TRC-20)`,
        "Use the wallet address provided below",
        `Include reference: ${order.orderNumber}`,
        "Send transaction hash to our WhatsApp",
        "Payment will be confirmed within 1 hour",
      ],
      walletAddresses: {
        usdt_trc20: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oREqjK",
        reference: order.orderNumber,
      },
    },
  }

  // Map common synonyms/variants to our lowercase keys
  const alias = {
    easypaisa: "easypaisa", // Correct spelling
    "easy-paisa": "easypaisa",
    "easy paisa": "easypaisa",
    jazzcash: "jazzcash",
    "jazz cash": "jazzcash",
    "bank transfer": "bank transfer",
    bank: "bank transfer",
    crypto: "crypto",
    bitcoin: "crypto",
    ethereum: "crypto",
    usdt: "usdt (trc-20)",
    "usdt (trc-20)": "usdt (trc-20)",
  }

  const key = alias[method] || method
  return instructions[key] || null
}

const sendEmail = async (type, to, subject, data) => {
  if (!transporter) {
    console.log("❌ Email transporter not configured, skipping email notification")
    console.log("   Please set up your Zoho email environment variables:")
    console.log("   EMAIL_HOST=smtp.zoho.com")
    console.log("   EMAIL_PORT=587")
    console.log("   EMAIL_USER=your_email@zohomail.com")
    console.log("   EMAIL_PASS=your_zoho_app_password")
    return
  }

  try {
    const htmlContent = getEmailTemplate(type, data)

    const mailOptions = {
      from: `"Glowing Gallery" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    }

    console.log(`📧 Sending email to ${to}: ${subject}`)
    await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent successfully to ${to}`)
  } catch (error) {
    console.error("❌ Email sending failed:", error.message)
    console.error("   Email type:", type, "to:", to)
    if (error.code === "EAUTH") {
      console.error("   Authentication failed - check your EMAIL_USER and EMAIL_PASS")
    } else if (error.code === "ECONNECTION") {
      console.error("   Connection failed - check EMAIL_HOST and EMAIL_PORT")
    } else if (error.response) {
      console.error("   SMTP response:", error.response)
    }
    throw error
  }
}

const sendWhatsApp = async (type, phone, data) => {
  if (!twilioClient) {
    console.log("Twilio not configured, skipping WhatsApp notification")
    return
  }

  const message = getWhatsAppMessage(type, data)

  // Format phone number for WhatsApp
  const formattedPhone = phone.startsWith("+") ? `whatsapp:${phone}` : `whatsapp:+${phone}`

  await twilioClient.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: formattedPhone,
    body: message,
  })
}

const sendOrderConfirmationEmail = async (order) => {
  const paymentInstructions =
    order.paymentMethod !== "COD" ? generatePaymentInstructions(order.paymentMethod, order) : null
  await sendEmail("orderConfirmation", order.customerInfo.email, `Order Confirmation - ${order.orderNumber}`, {
    order,
    paymentInstructions,
  })
}

const sendWhatsAppNotification = async (order) => {
  await sendWhatsApp("orderConfirmation", order.customerInfo.phone, { order })
}

const sendPaymentInstructions = async (order, type = "reminder") => {
  if (type === "confirmed") {
    await sendPaymentConfirmation(order)
  } else {
    await sendPaymentReminder(order)
  }
}

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendPaymentReminder,
  sendPaymentConfirmation,
  sendPaymentInstructions,
  sendOrderConfirmationEmail,
  sendWhatsAppNotification,
  sendEmail,
  sendWhatsApp,
}
