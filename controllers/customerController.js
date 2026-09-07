const Customer=require("../models/Customer.js");

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
const  getCustomers =async(req,res)=>{
    try {
      
        const  customers=await Customer.find().sort({createAt:-1});

        res.status(200).json({
        count: customers.length,
        customers,
        });
        
    } catch (error) {

      res.status(500).json({
      message: "Server error",
      error: error.message,
    });

    }
}

//Find Single Customer Details
const getCustomerById = async (req, res) => {
  try {
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