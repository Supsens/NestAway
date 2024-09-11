import express from 'express';
import { deleteUser, getUser, getUserListings, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';

export const UserRouter=express.Router();

UserRouter.post('/update/:id',verifyToken,updateUser)
UserRouter.delete('/delete/:id',verifyToken,deleteUser)
UserRouter.get('/listings/:id',verifyToken,getUserListings)
UserRouter.get('/:id',verifyToken,getUser)