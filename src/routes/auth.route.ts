import { Router } from "express";
import { login, signup } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);

export default authRouter;
