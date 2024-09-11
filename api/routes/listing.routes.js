import express from 'express';
import { createListing, deleteListing, getListing, updateListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';


export const listingrouter=express.Router();

listingrouter.delete('/delete/:id',verifyToken,deleteListing)
listingrouter.post('/create',verifyToken,createListing)
listingrouter.post('/update/:id',verifyToken,updateListing)

listingrouter.get('/get/:id',getListing)