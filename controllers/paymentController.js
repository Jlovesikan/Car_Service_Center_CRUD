const Payment = require("../models/Payment");
const Service = require("../models/Service");

const mongoose = require("mongoose");

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

    const{search, status, method}=req.query;

    const page=req.query.page||1;
    const limit=req.query.limit||10;

    if (page < 1 || limit < 1) {
    return res.status(400).json({
    message: "Page and limit must be greater than 0",
    });
    }

    const skip=(page-1)*limit;

    let filter={};

    if(search){
     filter.transactionId = {
        $regex: search,
        $options: "i",
     };
    }

      const validStatuses = [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ];

      const validStatus = validStatuses.find(
        (item) => item.toLowerCase() === status.toLowerCase()
      );

      if (status && !validStatus) {
        return res.status(400).json({
          message: "Invalid payment status",
        });
      }

    if (validStatus) {
      filter.paymentStatus = validStatus;
    }
      
      const validMethods = [
        "Cash",
        "Card",
        "Bank Transfer",
        "Online",
      ];

      const validMethod = validMethods.find(
        (item) => item.toLowerCase() === method.toLowerCase()
      );

      if (method && !validMethod) {
        return res.status(400).json({
          message: "Invalid payment method",
        });
      }
        if (validMethod) {
        filter.paymentMethod = validMethod;
        }
    const [payments, totalPayments] = await Promise.all([
      Payment.find(filter)
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
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip),

      Service.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalPayments / limit);

    res.status(200).json({
      count: payments.length,
      totalPayments,
      currentPage: page,
      totalPages,
      limit,
      message: payments.length === 0
      ? "No payment details found"
      : "Payments fetched successfully",
      payments,s
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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid payment ID",
    });
    }

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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid payment ID",
    });
    }
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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid payment ID",
    });
    }
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