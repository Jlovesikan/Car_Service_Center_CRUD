const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Online"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    transactionId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;