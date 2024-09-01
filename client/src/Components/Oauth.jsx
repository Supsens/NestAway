import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from "firebase/auth"
import {app} from "../firebase.js"
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'
const Oauth = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate();
    const GoogleSignuphandler=async()=>{
            try {
                const provider=new GoogleAuthProvider()
                const auth=getAuth(app)
                const result=await signInWithPopup(auth,provider);
               // console.log(result);
               const res=await fetch('/api/auth/google',{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL}),

               })
               const data=res.json()
               dispatch(signInSuccess(data))
               navigate("/")

            } catch (error) {
                console.log('couldnot signin with google ',error)
            }
    }
  return (
    <>
       <button  type="button" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 mb-6" onClick={GoogleSignuphandler}>
            Continue with Google
        </button >
    </>
  )
}

export default Oauth
