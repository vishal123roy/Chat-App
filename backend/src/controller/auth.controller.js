import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import multiavatar from '@multiavatar/multiavatar/esm';


export async function signup(req,res){
    const{email,password,fullName} = req.body;
    try {
         if(!email||!password||!fullName){
            return res.status(400).json({message:"All fields are required"});
            }
         if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
         }
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if(!emailRegex.test(email)){
            return res.status(400).json({message:'Invalid email format'});
         }

         const exisitingUser = await User.findOne({ email })
         if(exisitingUser){
            return res.status(400).json({message:'Email already exists, please use a different email'})
         }

         const randomAvatar = multiavatar('Binx Bond');

         const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic:randomAvatar,
         })

         try {
            await upsertStreamUser({
               id:newUser._id.toString(),
               name:newUser.fullName,
               image:newUser.profilePic || "",
            })
            console.log(`Stream user created for ${newUser.fullName}`);
         } catch (error) {
            console.log("error creating stream user",error)
         }

         const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:'7d'
         })
         res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production"
         })

         res.status(201).json({success:true,user:newUser});

    } catch (error) {
        console.log("Error in signup controller",error)
        res.status(500).json({message:"internal error"})
    }
   
}

export async function login(req,res){
    try {
      const { email, password } = req.body;

      if(!email||!password){
         return res.status(400).json({message:"All fields are required"});
      }

      const user = await User.findOne({email});
      if(!user){
         return res.status(401).json({message:"Invalid email or password"});
      }

      const isPasswordCorrect = await user.matchPassword(password);
      if(!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});
    
      const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:'7d'
         })
         res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production"
         })

        res.status(200).json({success:true, user});
   } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true, message:"logout successful"});
}

export async function onboard(req,res) {
   try {
      const userId = req.user._id;

      const { fullName, bio, location } = req.body;

      if(!fullName||!bio||!location){
         return res.status(400).json({message:"All fields are required",
            missingFields:[
               !fullName && "fullName",
               !bio && "bio",
               !location && "location"
            ].filter(Boolean),
         });
      }

      const updatedUser = await User.findByIdAndUpdate(userId,{
         ...req.body,
         isOnboarded:true,
      },{new:true})

      if(!updatedUser){
         return res.status(404).json({message:"User not found"});
      }

      try {
         await upsertStreamUser({
            id:updatedUser._id.toString(),
            name:updatedUser.fullName,
            image:updatedUser.profilePic||"",
         })
         console.log(`Stream user updated after onboardingfor ${updatedUser.fullName}`)
      } catch (streamError) {
         console.log("Error updating stream user during onboarding",streamError.message)
      }

      res.status(200).json({success:true,user:updatedUser});

   } catch (error) {
         console.error("onboarding error",error);
         res.status(500).json({message:"Internal server Error"});
   }
}
