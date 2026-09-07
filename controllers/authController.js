const bcrypt=require("bcryptjs");
const User=require("../models/User.js");
const jwt=require("jsonwebtoken");


//User Creation
const registerUser=async(req,res)=>{
    try {
        const{name,email,password}=req.body;

        if(!name){
        return res.status(400).json({
        message: "Please provide name...",
      });
    }
        if(!email){
        return res.status(400).json({
        message: "Please provide email...",
      });
    }
        if(!password){
        return res.status(400).json({
        message: "Please provide password...",
      });
    }
     
    const  existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword= await bcrypt.hash(password,10);

    const user= await User.create({
        name,
        email,
        password:hashPassword,
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    } catch (error) {
       res.status(400).json({
        message: "Server error",
        error: error.message,
       });
    }

}

//User Login
const loginUser=async(req,res)=>{
    try {
      const {email,password}=req.body;
      
      if(!email||!password){
        return res.status(400).json({
        message: "Please provide email and password",
      });
      }

      const user = await User.findOne({email});

      if(!user){

       return res.status(401).json({
        message: "Invalid email or password",
      });

      }

      const isPasswordMatch= await bcrypt.compare(
        password,
        user.password,
      );

      if(!isPasswordMatch){
        return res.status(401).json({
        message: "Invalid email or password",
      });
      }

      const token= jwt.sign(
        {
            userId:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d",
        },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
        
    } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

    }
}

//Get User Profile
const getProfile=async(req,res)=>{
   try {

    const user=await User.findById(req.user.userId).select("-password");
    if(!user){
        return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
    
   } catch (error) {

     res.status(500).json({
      message: "Server error",
      error: error.message,
    });

   } 
}

module.exports={registerUser,loginUser,getProfile,};