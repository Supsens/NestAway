import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false,
}
const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;

        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInfailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart:(state)=>{
            state.loading=true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserfailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
        },
        deleteUserSuccess:(state,action)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserfailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        signOutUserStart:(state)=>{
            state.loading=true;
        },
        signOutUserSuccess:(state,action)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        signOutUserfailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        
    }
})


export const {signInStart,signInSuccess,signInfailure,updateUserStart,updateUserSuccess,updateUserfailure,deleteUserStart,deleteUserSuccess,deleteUserfailure,signOutUserStart,signOutUserSuccess,signOutUserfailure}=UserSlice.actions;
export default UserSlice.reducer;