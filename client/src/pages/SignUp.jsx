import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Oauth from '../Components/Oauth';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!username || !email || !password) {
      toast.error("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsername('');
        setEmail('');
        setPassword('');
        setLoading(false);
        navigate('/sign-in');
      } else {
        setLoading(false);
        toast.error(data.message || "Something went wrong, please try again");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl h-[calc(100vh-7rem)] mx-auto shadow-lg mt-4 mb-4 rounded-lg overflow-hidden">
      <div className="flex flex-col justify-center items-center md:w-1/2 p-8 md:p-20 bg-white">
        <h1 className="text-2xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          Discover your <br /> perfect stay, <br /> anywhere in the world
        </h1>
        <h3 className="text-md sm:text-xs text-gray-600 mb-8 text-center">
          Sign up to unlock extraordinary experiences and accommodations
        </h3>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            {loading ? "Loading..." : "Sign up"}
          </button>

          {/* Continue With Google Button */}
         <Oauth/>
        </form>

        {/* Sign In Link */}
        <p className="text-gray-600">
          Have an account?{' '}
          <Link to="/sign-in" className="text-green-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?cs=srgb&dl=landscape-sky-clouds-259588.jpg&fm=jpg"
          alt="Scenic Landscape"
          className="w-full h-full object-cover"
        />
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} newestOnTop={true} />
    </div>
  );
};

export default SignUp;
