import express from "express";
import postRouter from "./src/routes/post.mjs";

const app = express();
// middleware that process body json;
app.use(express.json());

app.use(postRouter);

app.listen(3000,()=>{
    console.log("App running on port 3000");
})
