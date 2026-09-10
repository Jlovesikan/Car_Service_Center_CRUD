const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");

const connectDB=require("./config/db.js");

const authRoutes=require("./routes/authRoutes.js");
const customerRoutes = require("./routes/customerRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportsRoutes = require("./routes/reportsRoutes.js");

dotenv.config();

connectDB();

const app=express();

app.use(cors());
app.use(express.json());



app.use("/api/auth",authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "AutoCare API is running",
    })
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON format",
    });
  }

  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server Is Running:${PORT}`)
});

