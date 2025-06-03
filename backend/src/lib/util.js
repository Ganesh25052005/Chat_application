import jwt from 'jsonwebtoken';

export const generate_token = (userid,res)=>{
    const token = jwt.sign({userid},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        maxAge: 7*24*3600*1000, //milliseconds
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
} 
