import User from "../models/User";
import jwt from "jsonwebtoken";

//Middleware to protect routes
export const protectRoute = async (req,res,next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

// .select() allows you to include or exclude fields from the returned document.
// "-password" → exclude the password field from the result.
// Important because you never want to send hashed passwords to the client

    if(!user) return res.json({success:"false",message:"User not found"})

      req.user = user;
      next();
  } catch (error) {
    console.log(error.message);
     return res.json({success:"false",message:error.message})
  }
}