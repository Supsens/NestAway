import express from 'express';
import { deleteUser, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';

export const UserRouter=express.Router();

UserRouter.post('/update/:id',verifyToken,updateUser)
UserRouter.delete('/delete/:id',verifyToken,deleteUser)