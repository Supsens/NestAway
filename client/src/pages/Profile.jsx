import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserfailure } from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((store) => store.user);
  
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const dispatch = useDispatch();
  const [filepercentage, setFilepercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formdata, setFormData] = useState({});

  console.log(formdata, fileUploadError, filepercentage);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilepercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formdata, avatar: downloadURL });
        });
      }
    );
  };

  const handleFormdata = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserfailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data?.rest));
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserfailure(error.message));
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col p-6 items-center">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Profile
      </h1>

      <form className="flex flex-col w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formdata?.avatar || currentUser?.avatar}
          alt=""
          className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        {file && !fileUploadError && (
          <h3 className="text-sm font-text-center mb-2 text-green-400 text-center">
            {filepercentage !== 100
              ? `Uploading ${filepercentage}%`
              : `Uploaded Successfully`}
          </h3>
        )}
        <p className="text-center">
          {fileUploadError && (
            <span className="text-red-700 text-center">Error Image Upload (less than 2mb)</span>
          )}
        </p>
        <input
          type="text"
          placeholder={currentUser?.username}
          id="username"
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleFormdata}
        />
        <input
          type="email"
          placeholder={currentUser?.email}
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          id="email"
          onChange={handleFormdata}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          id="password"
          onChange={handleFormdata}
        />
        <button
          className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        {error && (
          <p className="text-red-500 text-center mt-2">{error}</p>
        )}
        <Link to="/">
          <button
            type="button"
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Create Listing
          </button>
        </Link>
      </form>

      <div className="flex gap-52 mb-3">
        <h3 className="text-red-500 cursor-pointer hover:text-red-600 transition-colors">
          Delete Account
        </h3>
        <h3 className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors">
          Sign out
        </h3>
      </div>
      <h3 className="text-green-600 cursor-pointer">Show Listing</h3>
    </div>
  );
}
