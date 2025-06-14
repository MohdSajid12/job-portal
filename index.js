import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoutes.js";
import companyRoute from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"
dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin : 'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));
const PORT =   process.env.PORT || 3000;

//apis
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/application",applicationRoutes);

app.listen(PORT ,()=>{
    connectDB();
    console.log(`server is running at the port ${PORT}`)
})