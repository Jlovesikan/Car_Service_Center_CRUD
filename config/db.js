const mongoose=require("mongoose");

const connectDB =async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is Connected...")
    } catch (error) {
        console.log(`Connection Erro:${error.message}`)
    }
}

module.exports=connectDB;