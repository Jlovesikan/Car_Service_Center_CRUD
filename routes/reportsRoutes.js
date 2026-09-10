const express = require("express");

const {
  getServiceReport,
  getPaymentReport
} = require("../controllers/reportsController.js");

const protect = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/services", protect, getServiceReport);
router.get("/payments", protect, getPaymentReport);

module.exports = router;