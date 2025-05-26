import jwt from "jsonwebtoken";
import cookie from "cookie-parser";

export const generateToken = async (userId,res)=>{

       
      const token =  await jwt.sign({ userId }, "chanikya", { expiresIn: '7d' });

    res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", 
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    
  });
   
  return token;

}