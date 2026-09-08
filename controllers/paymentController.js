const Payment = require("../models/Payment");
const Service = require("../models/Service");

//Create Payment details
const createPayment = async (req, res) => {
  try {
    const {
      service,
      amount,
      paymentDate,
      paymentMethod,
      paymentStatus,
      transactionId,
    } = req.body;

    
    if (
      !service ||
      amount === undefined ||
      !paymentDate ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

   
    const existingService = await Service.findById(service);

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    
    const payment = await Payment.create({
      service,
      amount,
      paymentDate,
      paymentMethod,
      paymentStatus,
      transactionId,
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Find All Payment Details
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "service",
        populate: [
          {
            path: "customer",
            select: "name email phone",
          },
          {
            path: "vehicle",
            select: "vehicleNumber brand model",
          },
          {
            path: "mechanic",
            select: "name phone specialization",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//FindOne Payment Details
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: "service",
        populate: [
          {
            path: "customer",
            select: "name email phone",
          },
          {
            path: "vehicle",
            select: "vehicleNumber brand model",
          },
          {
            path: "mechanic",
            select: "name phone specialization",
          },
        ],
      });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Update Payment Details
const updatePayment = async (req, res) => {
  try {
    const {
      service,
      amount,
      paymentDate,
      paymentMethod,
      paymentStatus,
      transactionId,
    } = req.body;

    
    if (service) {
      const existingService = await Service.findById(service);

      if (!existingService) {
        return res.status(404).json({
          message: "Service not found",
        });
      }
    }

    const updateData = {
      amount,
      paymentDate,
      paymentMethod,
      paymentStatus,
      transactionId,
    };

   
    if (service) {
      updateData.service = service;
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "service",
      populate: [
        {
          path: "customer",
          select: "name email phone",
        },
        {
          path: "vehicle",
          select: "vehicleNumber brand model",
        },
        {
          path: "mechanic",
          select: "name phone specialization",
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Delete Payment Details
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};