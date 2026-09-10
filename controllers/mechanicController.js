const Mechanic = require("../models/Mechanic");

const mongoose = require("mongoose");

//Create Mechanic Details
const createMechanic = async (req, res) => {
  try {
    const {
      name,
      phone,
      specialization,
      experience,
      status,
    } = req.body;

   
    if (
      !name ||
      !phone ||
      !specialization ||
      experience === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

   
    const mechanic = await Mechanic.create({
      name,
      phone,
      specialization,
      experience,
      status,
    });

    res.status(201).json({
      message: "Mechanic created successfully",
      mechanic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Find All Mechanic Details
const getMechanics = async (req, res) => {
  try {
    const { search } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be greater than 0",
      });
    }

    const skip = (page - 1) * limit;

    let filter = {};

    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const [mechanics, totalMechanics] = await Promise.all([
      Mechanic.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Mechanic.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalMechanics / limit);

    res.status(200).json({
      count: mechanics.length,
      totalMechanics,
      currentPage: page,
      totalPages,
      limit,
      message: mechanics.length === 0
      ? "No mechanics details found"
      : "Mechanics fetched successfully",
      mechanics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Find Single Mechanic Details
const getMechanicById = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid mechanic ID",
    });
    }

    const mechanic = await Mechanic.findById(req.params.id);

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    res.status(200).json({
      mechanic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Update Mechanic Details
const updateMechanic = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid mechanic ID",
    });
    }
    const {
      name,
      phone,
      specialization,
      experience,
      status,
    } = req.body;

    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        specialization,
        experience,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    res.status(200).json({
      message: "Mechanic updated successfully",
      mechanic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Delete Mechanic Details
const deleteMechanic = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid mechanic ID",
    });
    }

    const mechanic = await Mechanic.findByIdAndDelete(req.params.id);

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
      });
    }

    res.status(200).json({
      message: "Mechanic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createMechanic,
  getMechanics,
  getMechanicById,
  updateMechanic,
  deleteMechanic,
};