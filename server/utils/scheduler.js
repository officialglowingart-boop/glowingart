const cron = require("node-cron")
const Order = require("../models/Order")
const { sendPaymentReminder, sendStatusUpdate } = require("./notifications")

// Send payment reminders for pending orders after 24 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("Running payment reminder check...")

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

    // Find orders that are 24 hours old and still pending payment
    const pendingOrders = await Order.find({
      paymentStatus: "pending",
      orderStatus: "processing",
      createdAt: {
        $gte: fortyEightHoursAgo,
        $lte: twentyFourHoursAgo,
      },
      paymentMethod: { $ne: "COD" }, // Don't send reminders for COD orders
    })

    console.log(`Found ${pendingOrders.length} orders needing payment reminders`)

    for (const order of pendingOrders) {
      try {
        await sendPaymentReminder(order)
        console.log(`Payment reminder sent for order ${order.orderNumber}`)
      } catch (error) {
        console.error(`Failed to send reminder for order ${order.orderNumber}:`, error)
      }
    }
  } catch (error) {
    console.error("Payment reminder cron job error:", error)
  }
})

// Cancel orders that haven't been paid for after 48 hours
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running order cancellation check...")

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

    // Find orders that are 48+ hours old and still pending payment
    const expiredOrders = await Order.find({
      paymentStatus: "pending",
      orderStatus: "processing",
      createdAt: { $lte: fortyEightHoursAgo },
      paymentMethod: { $ne: "COD" },
    })

    console.log(`Found ${expiredOrders.length} expired orders to cancel`)

    for (const order of expiredOrders) {
      try {
        order.orderStatus = "cancelled"
        order.notes = "Automatically cancelled due to non-payment after 48 hours"
        await order.save()

        // Send cancellation notification
        await sendStatusUpdate(order)
        console.log(`Order ${order.orderNumber} cancelled due to non-payment`)
      } catch (error) {
        console.error(`Failed to cancel order ${order.orderNumber}:`, error)
      }
    }
  } catch (error) {
    console.error("Order cancellation cron job error:", error)
  }
})

console.log("Notification scheduler initialized")

module.exports = {
  // Export any scheduler functions if needed
}
