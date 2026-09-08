const Mechanic = require("../models/Mechanic");

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
    const mechanics = await Mechanic.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: mechanics.length,
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