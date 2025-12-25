import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./lib/socket.js";

//Middleware setup
app.use(express.json({limit:"4mb"})) //it will accept images upto 4 mb
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


//so when we run http://localhost:5000/api/status we can get message Server is Live
app.use("/api/status",(req,res)=>res.send("Server is Live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter)

//Connect to mongoDB
await connectDB()

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})