const Vehicle = require("../models/Vehicle");
const Customer = require("../models/Customer");

//Create Vehicle Details
const createVehicle = async (req, res) => {
  try {
    const {
      customer,
      vehicleNumber,
      brand,
      model,
      year,
      fuelType,
    } = req.body;

   
    if (
      !customer ||
      !vehicleNumber ||
      !brand ||
      !model ||
      !year ||
      !fuelType
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

  
    const existingCustomer = await Customer.findById(customer);

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

  
    const existingVehicle = await Vehicle.findOne({
      vehicleNumber,
    });

    if (existingVehicle) {
      return res.status(400).json({
        message: "Vehicle with this number already exists",
      });
    }

   
    const vehicle = await Vehicle.create({
      customer,
      vehicleNumber,
      brand,
      model,
      year,
      fuelType,
    });

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Find All Details
const getVehicles = async (req, res) => {
  try {
    const { search } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { vehicleNumber: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
        ],
      };
    }

    const [vehicles, totalVehicles] = await Promise.all([
      Vehicle.find(filter)
        .populate("customer", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Vehicle.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalVehicles / limit);

    res.status(200).json({
      count: vehicles.length,
      totalVehicles,
      currentPage: page,
      totalPages,
      limit,
      vehicles,
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Find Single Details
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("customer", "name email phone");

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Update Vehicle Details
const updateVehicle=async(req,res)=>{
    try {
    const  {
      customer,
      vehicleNumber,
      brand,
      model,
      year,
      fuelType,
    } = req.body;

    if(customer){
        const existingCustomer=await Customer.findById(customer);
        
        if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    if(vehicleNumber){
        const existingVehicle=await Vehicle .findOne({
            vehicleNumber,
            _id:{$ne:req.params.id},
        })

          if (existingVehicle) {
        return res.status(400).json({
          message: "Vehicle with this number already exists",
        });
      }
    }

        
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        customer,
        vehicleNumber,
        brand,
        model,
        year,
        fuelType,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("customer", "name email phone");

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
       error: error.message,
      }); 
    }
};

//Delete Vehicle Details
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};