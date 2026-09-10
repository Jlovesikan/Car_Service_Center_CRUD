const Service = require("../models/Service");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");
const Mechanic = require("../models/Mechanic");

const mongoose = require("mongoose");

//Create Service Details
const createService=async(req,res)=>{
    try {
       const {
        customer,
        vehicle,
        mechanic,
        serviceType,
        description,
        serviceDate,
        estimatedCost,
        finalCost,
        status,
       } =req.body;

    if (
      !customer ||
      !vehicle ||
      !mechanic ||
      !serviceType ||
      !description ||
      !serviceDate ||
      estimatedCost === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingCustomer=await Customer.findById(customer);
    if(!existingCustomer){
        return res.status(404).json({
        message: "Customer not found",
      });
    }

    const  existingVehicle=await Vehicle.findById(vehicle);
     if(!existingVehicle){
        return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if(existingVehicle.customer.toString() !== customer){
        return res.status(400).json({
        message: "Vehicle does not belong to this customer",
      });
    }

    const existingMechanic=await Mechanic.findById(mechanic)
    if(!existingMechanic){
        return res.status(404).json({
        message: "Mechanic not found",
      });
    } 
    
    const service = await Service.create({
      customer,
      vehicle,
      mechanic,
      serviceType,
      description,
      serviceDate,
      estimatedCost,
      finalCost,
      status,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
    
    } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });  
    }
};

//Find All Service
const getServices = async (req, res) => {
  try {

    const {search,status}=req.query;

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
      filter.$or=[
        {servicetype:{$regex:search,$options:"i"}},
        {description:{$regex:search,$options:"i"}},
      ]
    }

    const validStatuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (status && !validStatuses.includes(status)) {
     return res.status(400).json({
      message: "Invalid service status",
    });
    }

    if(status){
      filter.status=status;
    }
    const [services,totalServices] = await Promise.all([
      Service.find(filter)
      .populate("customer", "name email phone")
      .populate("vehicle", "vehicleNumber brand model year")
      .populate("mechanic", "name phone specialization")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip),

       Service.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalServices / limit);

    res.status(200).json({
      count: services.length,
      totalServices,
      currentPage: page,
      totalPages,
      limit,
      message: services.length === 0
      ? "No payment details found"
      : "Payments fetched successfully",
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//FindOne Service Details
const getServiceById = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid service ID",
    });
    }

    const service = await Service.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("vehicle", "vehicleNumber brand model year")
      .populate("mechanic", "name phone specialization");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Update Service Details
const updateService = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid service ID",
    });
    }

    const {
      customer,
      vehicle,
      mechanic,
      serviceType,
      description,
      serviceDate,
      estimatedCost,
      finalCost,
      status,
    } = req.body;

    
    if (customer) {
      const existingCustomer = await Customer.findById(customer);

      if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    
    if (vehicle) {
      const existingVehicle = await Vehicle.findById(vehicle);

      if (!existingVehicle) {
        return res.status(404).json({
          message: "Vehicle not found",
        });
      }

     
      if (
        customer &&
        existingVehicle.customer.toString() !== customer
      ) {
        return res.status(400).json({
          message: "Vehicle does not belong to this customer",
        });
      }
    }

    
    if (mechanic) {
      const existingMechanic = await Mechanic.findById(mechanic);

      if (!existingMechanic) {
        return res.status(404).json({
          message: "Mechanic not found",
        });
      }
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        customer,
        vehicle,
        mechanic,
        serviceType,
        description,
        serviceDate,
        estimatedCost,
        finalCost,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customer", "name email phone")
      .populate("vehicle", "vehicleNumber brand model year")
      .populate("mechanic", "name phone specialization");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Delete Service Details
const deleteService = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid service ID",
    });
    }

    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports={
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
}