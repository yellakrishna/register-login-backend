import express from "express";
import User from "../model/FormSchema.js";
const router = express.Router();
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secretKey =process.env.SECRETKEY

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ status: false, message: "All files are require" })

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ status: false, message: "Email Already registered" });

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ name, email, password:hashPassword });
        await newUser.save();

        return res.status(201).json({ status: true, message: "Register successful",data:newUser })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
})

router.post('/login', async(req,res)=>{
    try {
        const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({ status: false, message: "All files are require" })
    }

    const user = await User.findOne({email})
    
    if(!user || !await bcrypt.compare(password,user.password)) return  res.status(400).json({ status: false, message: "user n0t same" });

    const token = jwt.sign({id:user._id,email:user.email}, secretKey,{expiresIn:"1hr"})

    res.cookie('authToken', token,{
        httpOnly:true,
        secure:false,
        sameSite:'strict',
        maxAge:60*60*1000,
    })
 return res.status(201).json({ status: true, message: "Login successful",token })

    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
})

router.post('/profile', async (req,res)=>{
    try {
        const token = req.cookies.authToken

         if (!token) return res.status(400).json({ status: false, message: "access denied" });

         jwt.verify(token,secretKey, async(err,decode)=>{
            const user =await User.findById(decode.id)
            if(!user) return res.status(400).json({status:false,message:'invaild token'})
            
                const userData = {
            id:user.id,
            name : user.name,
            email : user.email
         }
          return res.status(201).json({ status: true, message: "Profile Data", data: userData })
         })
         
        
    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
})

router.post('/logout',(req,res)=>{
    res.clearCookie("authToken")
     res.status(201).json({ status: true, message: "logout success" })
})

export default router;