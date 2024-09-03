import express from 'express';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';

export const UserRouter=express.Router();

UserRouter.post('/update/:id',verifyToken,updateUser)