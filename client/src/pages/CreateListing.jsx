import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, SetformData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5000,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const {currentUser}=useSelector((state)=>state.user)
  const [uploading, setUploading] = useState(false);
   const [error, setError] = useState(false);
   const [loading, setLoading] = useState(false);
  console.log(files);
  console.log(formData);
  const navigate=useNavigate()

  const handleImageSubmit = (e) => {
    e.preventDefault();

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          SetformData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload Failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 listing images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImagedelete = (index) => {
    SetformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    // If the input is a checkbox, use checked instead of value
    SetformData((prevState) => ({
      ...prevState,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit= async(e)=>{
    e.preventDefault();
    if(formData.imageUrls.length<1){
      return setError("Please upload at least one image");
    }
    if(+formData.regularPrice<+formData.discountedPrice){
      return setError("Discounted price should be less than regular price");
    }
    try {
      setLoading(true);
      const res= await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,userRef: currentUser._id}),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success=== false) {
        setError(data.message); 
      }
      navigate(`/listings/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }

  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4 shadow-xl rounded-xl p-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                name="type"
                id="type"
                value="sale"
                className="w-5"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                name="type"
                id="type"
                value="rent"
                className="w-5"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-600 rounded-lg"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-600 rounded-lg"
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                min="5000"
                max='1000000000'
                required
                className="p-3 border border-gray-600 rounded-lg"
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-xs">(₹/Month)</span>
              </div>
            </div>
            {formData.offer && (
                 <div className="flex items-center gap-2">
            
                 <input
                   type="number"
                   name="discountedPrice"
                   id="discountedPrice"
                   min="0"
                   max='1000000000'
                   required={formData.offer}
                   className="p-3 border border-gray-600 rounded-lg"
                   value={formData.discountedPrice}
                   onChange={handleChange}
                 />
                 <div className="flex flex-col items-center">
                   <span>Discounted Price</span>
                   <span className="text-xs">(₹/Month)</span>
                 </div>
               </div>
              )}
           
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6)
          </span>

          <div className="flex gap-4">
            <input
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-600 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              onClick={handleImageSubmit}
              className="p-3 text-green-700 rounded border border-green-700 uppercase hover:shadow-md disabled:opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="Listing"
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95"
                  onClick={() => handleImagedelete(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80"
            disabled={loading || uploading}
          >
            {loading?'Creating...':'Create Listing'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
