import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';


export const listingrouter=express.Router();

listingrouter.post('/create',verifyToken,createListing)