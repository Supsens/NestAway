import mongoose from "mongoose";

export const Connect=async()=>{
    


    try {
        const res=await mongoose.connect(process.env.MONGODB_URL);
        if(res)
        {
            console.log("Database Connenct");
            
        }
        else{
            throw new Error("{Problem in connecting database")        }
        
    } catch (error) {
        console.log(error);
        
    }
    

}