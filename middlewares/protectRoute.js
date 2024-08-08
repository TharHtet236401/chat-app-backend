import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Ensure the path and extension are correct

const protectRoute = async (req, res, next) => {
    try{
       const token = req.cookies.jwt;
       if(!token){
        return res.status(401).json({message: "No Token, Unauthorized"});
       }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);

       if(!decoded){
        return res.status(401).json({message: "Invalid Token"});
       }

       const user = await User.findById(decoded.id).select("-password");

       if(!user){
        return res.status(401).json({message: "User not found"});
       }
       
       req.user = user; 
       next();       
       
    }catch(error){
        res.status(500).json({message: "error.Message"});
    }
}

export default protectRoute;