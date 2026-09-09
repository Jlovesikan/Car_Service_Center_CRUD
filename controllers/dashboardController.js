const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");
const Mechanic = require("../models/Mechanic");
const Service = require("../models/Service");
const Payment = require("../models/Payment");

//Get All Stats
const getDashboardStats=async(req,res)=>{
    try{
       const[
        totalCustomers,
        totalVehicles,
        totalMechanics,
        totalServices,
        totalPayments,
        pendingServices,
        completedServices,
        totalRevenue,
       ]= await Promise.all([
        Customer.countDocuments(),
        Vehicle.countDocuments(),
        Mechanic.countDocuments(),
        Service.countDocuments(),
        Payment.countDocuments(),

        Service.countDocuments({
            status:"Pending",
        }),

        Service.countDocuments({
        status: "Completed",
        }),

        Payment.aggregate([
            {
             $match:{
                paymentStatus: "Paid",
             },
            },

            {
               $group:{
                _id:null,
                total:{$sum:"$amount"},
               },
            },
        ]),
       ]);

        res.status(200).json({
            totalCustomers,
            totalVehicles,
            totalMechanics,
            totalServices,
            totalPayments,
            pendingServices,
            completedServices,
            totalRevenue:totalRevenue.length > 0
            ? totalRevenue[0].total : 0,
        });
    }catch(error){
      res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    }
};

//Get Recent Service
const getRecentServices=async(req,res)=>{
   try {
    
const services=await Service.find()
   .populate("customer","name email phone")
   .populate("vehicle", "vehicleNumber brand model")
   .populate("mechanic", "name phone specialization")
   .sort({ createdAt: -1 })
   .limit(5);

res.status(200).json({
    count: services.length,
    services,
});

   } catch (error) {
    
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

   }
};

//Get Recent Payment
const  getRecentPayments=async(req,res)=>{
   try {
     const payments= await Payment.find()
     .populate({
        path:"service",
        populate:[
         {
            path: "customer",
             select: "name email phone",
         },
          {
            path: "vehicle",
            select: "vehicleNumber brand model",
          },
          {
            path: "mechanic",
            select: "name phone specialization",
          },
        ],
     })
    .sort({ createdAt: -1 })
    .limit(5);


    res.status(200).json({
      count: payments.length,
      payments,
    });


   } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

   }
};

module.exports={getDashboardStats,getRecentServices,getRecentPayments}