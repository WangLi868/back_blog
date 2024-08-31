import {Router} from "express";
import checkAuthMiddleware from "../middlewares/authMiddleware.mjs";

const userRouter = Router();

let users = [
    {
      id: 1,
      username: "hakmi672",
      email:"hakmi@gmail.com",
      password: "654321",
    },
    {
      id: 2,
      username: "aitmouss672",
      email:"aitmouss@gmail.com",
      password: "123456",
    },
  ];

userRouter.get("/api/users",checkAuthMiddleware(["admin"]),(req,res)=>{

    res.status(200).json(users);
})

userRouter.get("/api/users/:id",checkAuthMiddleware(["admin","author"]),(req,res)=>{

    const {id} =req.params;
    const foundUser = users.find((u)=>u.id === +id);
    if(foundUser){
        res.json(foundUser);
    }
    res.status(404).json({ message: "user not found!" });

})

userRouter.post("/api/users",checkAuthMiddleware(["admin"]),(req,res)=>{
    const {username,email,password}=req.body;
    const newUser = {
        id:users.length+1,username,email,password
    }
    users.push(newUser);
    res.status(201).json({ message: "user created successfully!" });
})

userRouter.delete("/api/users/:id",checkAuthMiddleware(["admin", "author"]),(req,res)=>{
    const {id} = req.params;
    const deleteUser=users.filter(u=>u.id!==id);
    if(deleteUser) res.status(404).json({message: "user not found"});
})

userRouter.put("/api/users/:id",checkAuthMiddleware(["admin", "author"]),(req,res)=>{
    const {id} = req.params;
    const {username,email,password}=req.body;
    const foundUser = users.find((u)=>u.id === +id);

    if(username) foundUser.username =username;
    if(email) foundUser.email =email;
    if(password) foundUser.password =password;
    res.json({message: "user modified"});

})

export default userRouter;