const express = require("express");

const {
  createMechanic,
  getMechanics,
  getMechanicById,
  updateMechanic,
  deleteMechanic,
} = require("../controllers/mechanicController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createMechanic);
router.get("/", protect,  getMechanics);
router.get("/:id", protect, getMechanicById);
router.put("/:id", protect, updateMechanic);
router.delete("/:id", protect,deleteMechanic);

module.exports = router;