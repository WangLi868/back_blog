import express from "express";
import routes from "./src/routes/index.mjs";
import cors from "cors";


const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));// middleware that process body json;
app.use(express.json());

app.use(routes);

app.listen(3000,()=>{
    console.log("App running on port 3000");
})
