const express=require("express");

const {getDashboardStats,
    getRecentServices,
    getRecentPayments}=require("../controllers/dashboardController.js");
const protect = require("../middleware/authMiddleware.js");

const router=express.Router();

router.get("/stats",protect,getDashboardStats);

router.get("/recent-services", protect, getRecentServices);

router.get("/recent-payments", protect, getRecentPayments);

module.exports=router;