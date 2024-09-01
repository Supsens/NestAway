import express from 'express';
import { google, Signin, SignUp } from '../controllers/auth.controller.js';

export const AuthRouter=express.Router();

AuthRouter.post("/signup",SignUp)
AuthRouter.post("/signin",Signin)
AuthRouter.post("/google",google)