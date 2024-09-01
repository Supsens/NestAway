import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { signInfailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import Oauth from '../Components/Oauth';

const Signin = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const validateInput = () => {
    if (!email || !password) {
      toast.error("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`welcome ${data?.rest?.username}`);
        setEmail('');
        setPassword('');
        setLoading(false);
        setTimeout(()=>{
          navigate('/');
        },1000)
        dispatch(signInSuccess(data));
      } else {
        setLoading(false);
        dispatch(signInfailure(data.message))
        toast.error(data.message || "Something went wrong, please try again");
      }
    } catch (error) {
      setLoading(false);
      dispatch(signInfailure(error.message))
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl h-[calc(100vh-7rem)] mx-auto shadow-lg mt-4 mb-4 rounded-lg overflow-hidden">
      <div className="flex flex-col justify-center items-center md:w-1/2 p-8 md:p-20 bg-white">
        <h1 className="text-2xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          Welcome Back<br /> perfect stay, <br /> anywhere in the world
        </h1>
        <h3 className="text-md sm:text-xs text-gray-600 mb-8 text-center">
         Login to unlock extraordinary experiences and accommodations
        </h3>
        <form onSubmit={handleSignin}>
          <input

            type="email"
            placeholder="Jhondoe@gmail.com"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {/* Sign Up Button */}
          <button
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 mb-4"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>

          {/* Continue With Google Button */}
         <Oauth/>
        </form>

        {/* Sign In Link */}
        <p className="text-gray-600">
          Dont Have an account?{' '}
          <Link to="/sign-up" className="text-green-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Scenic Landscape"
          className="w-full h-full object-cover"
        />
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} newestOnTop={true} />
    </div>
  );
};

export default Signin;
