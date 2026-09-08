const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    estimatedCost: {
      type: Number,
      required: true,
      min: 0,
    },

    finalCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;