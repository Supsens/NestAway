import { Listing } from "../Models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing =async(req,res,next)=>{
    try {
        
     const listing=await Listing.create(req.body);
     return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}



export const deleteListing =async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id);
     if(!listing) return next(errorHandler(404,"Listing not found"));
     if(toString(req.user.id)!== toString(listing.userRef)) return next(errorHandler(401,"Unauthorised"));
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Listing has been deleted"});
    } catch (error) {
        next(error)
    }
}


export const updateListing =async(req,res,next)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404,"Listing not found"));
    if(toString(req.user.id)!== toString(listing.userRef)) return next(errorHandler(401,"Unauthorised"));

    try {
        const updatedListing=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(200).json(updatedListing);
    } catch (error) {
        next(error)
    }
}



export const getListing =async(req,res,next)=>{

    try {
        const listing=await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404,"Listing not found"));
    return res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
    
}