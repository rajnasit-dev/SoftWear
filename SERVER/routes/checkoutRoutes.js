const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//RAZORPAY OBJECT
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route POST /api/checkout/:id/create-order
// @desc Create Razorpay order
// @access Private
router.post("/:id/create-order", protect, async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay configuration missing",
        details: [
          !process.env.RAZORPAY_KEY_ID ? "RAZORPAY_KEY_ID" : null,
          !process.env.RAZORPAY_KEY_SECRET ? "RAZORPAY_KEY_SECRET" : null,
        ].filter(Boolean),
      });
    }

    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    const options = {
      amount: checkout.totalPrice * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${checkout._id}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    checkout.razorpayOrderId = order.id;
    await checkout.save();

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // frontend will use this
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    const msg = error?.message || "Server Error";
    res.status(500).json({ message: msg });
  }
});


// @route POST /api/checkout/:id/verify-payment
// @desc Create a new verify payment
// @access Private
router.post("/:id/verify-payment", protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      checkout.isPaid = true;
      checkout.paymentStatus = "paid";
      checkout.paymentDetails = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      };
      checkout.razorpayPaymentId = razorpay_payment_id;
      checkout.paidAt = Date.now();

      await checkout.save();

      res.status(200).json({ success: true, message: "Payment verified", checkout });
      
    } else {
      res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  // Basic payload validation to avoid generic 500s
  const missingFields = [];
  if (!shippingAddress || typeof shippingAddress !== "object") {
    missingFields.push("shippingAddress");
  } else {
    ["address", "city", "postalCode", "country"].forEach((f) => {
      if (!shippingAddress[f]) missingFields.push(`shippingAddress.${f}`);
    });
  }
  if (!paymentMethod) missingFields.push("paymentMethod");
  if (typeof totalPrice !== "number") missingFields.push("totalPrice");

  if (missingFields.length) {
    return res.status(400).json({
      message: "Validation error",
      details: missingFields,
    });
  }

  try {
    //Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkout session: ", error);
    res.status(500).json({ message: "Server Error." });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found." });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error." });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found." });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      //Create final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      // Mark the checkout as finalized.
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized." });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error." });
  }
});


module.exports = router;