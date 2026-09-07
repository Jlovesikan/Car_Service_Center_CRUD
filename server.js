const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");

const connectDB=require("./config/db.js");

const authRoutes=require("./routes/authRoutes.js");
const customerRoutes = require("./routes/customerRoutes");


dotenv.config();

connectDB();

const app=express();

app.use(cors());
app.use(express.json());



app.use("/api/auth",authRoutes);
app.use("/api/customers", customerRoutes);

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "AutoCare API is running",
    })
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server Is Running:${PORT}`)
});

