const Customer=require("../models/Customer.js");
const mongoose =require("mongoose")

//Create Customer Details
const createCustomer=async(req,res)=>{
    try {
       
    const {name, email, phone, address}=req.body;

    if(!name|| !email|| !phone|| !address){

    return res.status(400).json({
        message: "Please provide all required fields",
      
    });

    }

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer with this email already exists",
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
        
    } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

    }
}

//Find All Customer Details
const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const page=Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;

    if (page < 1 || limit < 1) {
    return res.status(400).json({
    message: "Page and limit must be greater than 0",
    });
    }

    const skip=((page-1) * limit);

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const [customers,totalCustomers] = await Promise.all([
      Customer.find(filter)
      .sort({
      createdAt: -1,})
      .skip(skip)
      .limit(limit),

      Customer.countDocuments(filter),
    ]);

    const totalPages=Math.ceil(totalCustomers/limit);


    res.status(200).json({
      count: customers.length,
      totalCustomers,
      currentPage: page,
      totalPages,
      limit,
      message: customers.length === 0
      ? "No customers details found"
      : "Customers fetched successfully",
      customers,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Find Single Customer Details
const getCustomerById = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Update Customer Details
const updateCustomer=async(req,res)=>{
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
        message: "Invalid customer ID",
        });
        }

        const { name, email, phone, address } = req.body;
        const customer= await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address },
            {new:true,runValidators:true}
        );

        if (!customer) {
        return res.status(404).json({
            message: "Customer not found",
        });
        }

        res.status(200).json({
        message: "Customer updated successfully",
        customer,
        });
        
    } catch (error) {
         
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

    }
}

//Delete Customer Details
const deleteCustomer = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
    message: "Invalid customer ID",
    });
    }
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports={createCustomer,getCustomers,getCustomerById,updateCustomer,deleteCustomer };