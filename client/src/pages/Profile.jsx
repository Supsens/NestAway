import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function Profile() {
  const { currentUser } = useSelector((store) => store.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  const [filepercentage, setFilepercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const [formdata, setFormData] = useState({});
  // console.log(formdata,fileUploadError,filepercentage);

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

  return (
    <div className="flex flex-col p-6 items-center ">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Profile
      </h1>

      <form className="flex flex-col w-full max-w-sm space-y-4 ">
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
            {filepercentage != 100
              ? `uploading ${filepercentage} %`
              : `Uploaded Succesfully`}
          </h3>
        )}
        <p className="text-center">
          {fileUploadError && (
            <span className="text-red-700 text-center">Error Image Upload(less than 2mb)</span>
          )}
        </p>
        <input
          type="text"
          placeholder={currentUser?.username}
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 "
        />
        <input
          type="email"
          placeholder={currentUser?.email}
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
          Update
        </button>
        <Link to="/">
          <button
            type="button"
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors "
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
