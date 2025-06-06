import jwt from 'jsonwebtoken';
import users from '../models/user.model.js';

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            delete req.user;
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded = jwt.decode(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message:"Unauthorized"});

        const user = await users.findById(decoded.userid).select("-password");
        
        if(!user) return res.status(401).json({message:"User not found"});
        
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
    }
}
