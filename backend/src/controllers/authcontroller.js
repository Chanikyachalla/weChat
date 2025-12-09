import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/util.js";
import cloudinary from "../config/clodinary.js";

export const signup = async (req, res) => {
  const {  email,fullName ,   password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "the password should be of minimum length 6" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "the email already exsists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser = await User.create({
      email: email,
      fullName: fullName,
      password: hashedpassword,
    });

    if (newuser) {
      generateToken(newuser._id, res);

      await newuser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user Data" });
    }
  } catch (error) {
   console.error("Signup error:", error);

    res.status(500).json({ message: "some error in auth sign up" });
  }
};


export const login = async (req,res) =>{
    const {email , password} = req.body ;

    try {
        const user =  await User.findOne({email});
        if(user){

             const isPasswordCorrect = await bcrypt.compare(password, user.password);
             if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
            await  generateToken(user._id , res);
            res.status(200).json({ 
                _id: user._id,
               fullName: user.fullName,
               email: user.email,
               profilePic: user.profilePic,
            })
        }
        else{
            res.status(400).json({message:"Invalid username and password "});
        }
        
    } catch (error) {
        console.log("some error in the login controler" , error.message);
        res.status(500).json({message: "some internal error in the login controler"});
        
    }
}

export const logout = async (req,res) =>{
     res.clearCookie('token' );
     res.status(200).json({message:" user logged out "});

}

export const updateProfile = async (req , res) =>{
  try{
    const {profilePic} = req.body ;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message: "profile pic is required "});
    }

     const uploadResponse = await cloudinary.uploader.upload(profilePic);
     const updatedUser = await User.findByIdAndUpdate(userId , {profilePic : uploadResponse.secure_url} , {new: true });

     res.status(200).json(updatedUser);
  } catch (error){
    console.log("some error in the profile piic ploadin in login controller " , error.message);
        res.status(500).json({message: "some internal error in the profile piic ploadin in login controller"});
  }
    
} 

export const checkAuth = async (req, res) => {
   try{
    req.User(200).json(req.user);
   }
   catch(error){
    console.log("some error in the check auth controller " , error.message);
        res.status(500).json({message: "some internal error in the check auth controller"});
   }
  }
