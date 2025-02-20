import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./db/connect.js";
import userRouter from "./routes/user_routes.js";
import deviceRouter from "./routes/device_routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","OPTIONS","PATCH"],
    credentials: true,
    allowedHeaders: ['Access-Control-Allow-Headers','Content-Type','Authorization','Accept','Origin','X-Requested-With'],
}));
app.options('*',cors());
app.use("/user",userRouter);
app.use("/device",deviceRouter);

const start = async ()=>{
    try{
        await connectDB(process.env.MONGODB_TEST_URL);
        app.listen(PORT, ()=>{
            console.log("Example app listening on http://localhost:%s",PORT);
        })
    }catch(err){
        console.log("Failed to connect!!");
    }
};

start();