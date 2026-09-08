const express = require("express");

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPayment);
router.get("/", protect, getPayments);
router.get("/:id", protect,  getPaymentById);
router.put("/:id", protect,  updatePayment);
router.delete("/:id", protect,  deletePayment);


module.exports = router;