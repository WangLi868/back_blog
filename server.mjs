import express from "express";
import routes from "./src/routes/index.mjs"

const app = express();
// middleware that process body json;
app.use(express.json());

app.use(routes);

app.listen(3000,()=>{
    console.log("App running on port 3000");
})
