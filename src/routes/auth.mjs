import { Router } from "express";
import jwt from "jsonwebtoken";
import { validateJwtToken, getJwtToken } from "../utils/jwt.mjs";
import dotenv from "dotenv";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authRouter = Router(); 

const user = {
    username:"oren",
    email:"oren@gmail.co",
    password:"123456"
}



const tokens = new Map();

// (key, value) -> key= accessToken, value= true


authRouter.post("/api/auth/login",(req,res)=>{
    const {email, password} = req.body;
    if(user.email===email&& user.password===password){
        const accessToken = jwt.sign({email: user.email, role: "user"}, accessTokenSecret,{
          expiresIn: '4m',
        })
        tokens.set(accessToken, true);
        res.json({ accessToken, tokens: Array.from(tokens) });    
    }

    res.status(401).json({message: "invalid credentials"});
})

//test the logout
authRouter.get("/api/auth/test", (req, res)=>{
    const accessToken= getJwtToken(req);
    if(tokens.get(accessToken)){ // token : false => !token: true;
        res.json({message: "Welcome back.", tokens: Array.from(tokens)});
    }
    
    return res.status(403).json({message: "Expired credentials", accessToken: tokens.get(accessToken)});
})


authRouter.get("/api/auth/logout",(req,res)=>{
    const accessToken= getJwtToken(req);
    
    if(tokens.has(accessToken)) { // tokens? accessToken, true
        tokens.set(accessToken, false); // token -> false,
        return res.json({message: "logged out", tokens: Array.from(tokens)})
    }
    
    res.status(400).json({message: "Bad request"});
});

export default authRouter;