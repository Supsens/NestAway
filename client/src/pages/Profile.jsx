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
import {
  updateUserStart,
  updateUserSuccess,
  updateUserfailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserfailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserfailure,
} from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((store) => store.user);

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const dispatch = useDispatch();
  const [filepercentage, setFilepercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formdata, setFormData] = useState({});
  const [UserListing, setUserListing] = useState({});
  const [ShowListingError, setShowListingError] = useState(false);
  console.log(formdata, fileUploadError, filepercentage);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleDeleteListing = async (ListingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${ListingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
      }

      setUserListing((prev)=>
        prev.filter((listing) => listing._id !== ListingId)
      );
      toast.success("Listing Deleted Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserfailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserfailure(error.message));
      toast.error("Failed to delete the profile");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signOutUserfailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      toast.error("Failed to Signout");
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser?._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      console.log(data);
      setUserListing(data);
      return;
    } catch (error) {
      setShowListingError(true);
    }
  };
  return (
    <div className="flex flex-col p-6 items-center">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Profile
      </h1>

      <form
        className="flex flex-col w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
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
            <span className="text-red-700 text-center">
              Error Image Upload (less than 2mb)
            </span>
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
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <Link to="/create-listing">
          <button
            type="button"
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Create Listing
          </button>
        </Link>
      </form>

      <div className="flex gap-52 mb-3">
        <h3
          className="text-red-500 cursor-pointer hover:text-red-600 transition-colors"
          onClick={handleDeleteUser}
        >
          Delete Account
        </h3>
        <h3
          className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleSignOut}
        >
          Sign out
        </h3>
      </div>
      <h3 className="text-green-600 cursor-pointer" onClick={handleShowListing}>
        Show Listing
      </h3>
      <p>{ShowListingError && <span className="text-red-700">Error</span>}</p>
      {UserListing &&
        UserListing.length > 0 &&
        UserListing.map((Listing) => (
          <div
            key={Listing?._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-sm flex flex-col sm:flex-row gap-6 items-center"
          >
            <Link
              to={`/listing/${Listing._id}`}
              className="block w-full sm:w-1/2"
            >
              <img
                src={Listing?.imageUrls[0]}
                alt={Listing?.name}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-6 flex-1 w-full sm:w-1/2">
              <Link to={`/listing/${Listing._id}`} className="block mt-2">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-green-500 transition-colors">
                  {Listing?.name}
                </h3>
              </Link>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  onClick={() => handleDeleteListing(Listing._id)}
                >
                  Delete
                </button>
                <Link to={`/update-listing/${Listing._id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Edit
                </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
