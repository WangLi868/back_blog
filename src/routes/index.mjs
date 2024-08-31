import {Router} from "express";
import postRouter from "./post.mjs";
import authRouter from "./auth.mjs";
import userRouter from "./user.mjs";


const routes = Router();
routes.use(postRouter);
routes.use(authRouter);
routes.use(userRouter);


export default routes;
