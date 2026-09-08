const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "Inactive"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Mechanic = mongoose.model("Mechanic", mechanicSchema);

module.exports = Mechanic;