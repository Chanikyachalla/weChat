import jwt from "jsonwebtoken";
import cookie from "cookie-parser";

export const generateToken = async (userId)=>{



      const token =  await jwt.sign({ userId,signedby: "chanikya" }, process.env.JWT_SCERET, { expiresIn: '7d' });
      
  return token;

}

