import {Router} from "express";
import postRouter from "./post.mjs";
import authRouter from "./auth.mjs";

const routes = Router();
routes.use(postRouter);
routes.use(authRouter);

export default routes;
