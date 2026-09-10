const Service=require("../models/Service.js");
const Payment = require("../models/Payment.js");


//Find And Filter Service Reports
const getServiceReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    let filter = {};

    if (from || to) {
      filter.serviceDate = {};

      if (from) {
        filter.serviceDate.$gte = new Date(from);
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);

        filter.serviceDate.$lte = toDate;
      }
    }

    const [
      totalServices,
      pendingServices,
      inProgressServices,
      completedServices,
      cancelledServices,
      totalEstimatedCost,
      totalFinalCost,
    ] = await Promise.all([
      Service.countDocuments(filter),

      Service.countDocuments({
        ...filter,
        status: "Pending",
      }),

      Service.countDocuments({
        ...filter,
        status: "In Progress",
      }),

      Service.countDocuments({
        ...filter,
        status: "Completed",
      }),

      Service.countDocuments({
        ...filter,
        status: "Cancelled",
      }),

      Service.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$estimatedCost" },
          },
        },
      ]),

      Service.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$finalCost" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      message:totalServices === 0 
      ?"No service data found for the selected date range..."
      :"service data found for the selected date range...",  
      totalServices,
      pendingServices,
      inProgressServices,
      completedServices,
      cancelledServices,

      totalEstimatedCost:
        totalEstimatedCost.length > 0
          ? totalEstimatedCost[0].total
          : 0,

      totalFinalCost:
        totalFinalCost.length > 0
          ? totalFinalCost[0].total
          : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


//Find And Filter Payment Reports
const getPaymentReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    let filter = {};

    if (from || to) {
      filter.paymentDate = {};

      if (from) {
        filter.paymentDate.$gte = new Date(from);
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);

        filter.paymentDate.$lte = toDate;
      }
    }

    const [
      totalPayments,
      pendingPayments,
      paidPayments,
      failedPayments,
      refundedPayments,
      totalPaidRevenue,
    ] = await Promise.all([
      Payment.countDocuments(filter),

      Payment.countDocuments({
        ...filter,
        paymentStatus: "Pending",
      }),

      Payment.countDocuments({
        ...filter,
        paymentStatus: "Paid",
      }),

      Payment.countDocuments({
        ...filter,
        paymentStatus: "Failed",
      }),

      Payment.countDocuments({
        ...filter,
        paymentStatus: "Refunded",
      }),

      Payment.aggregate([
        {
          $match: {
            ...filter,
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    res.status(200).json({
      message:
        totalPayments === 0
          ? "No payment data found for the selected date range..."
          : "Payment data found for the selected date range...",

      totalPayments,
      pendingPayments,
      paidPayments,
      failedPayments,
      refundedPayments,

      totalPaidRevenue:
        totalPaidRevenue.length > 0
          ? totalPaidRevenue[0].total
          : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports={getServiceReport,getPaymentReport}