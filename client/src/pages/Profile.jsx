import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [showListingLoading, setShowListingLoading] = useState(false);
  const [listings, setListings] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const response = await fetch("/api/user/update/" + currentUser._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
      }
      dispatch(updateUserSuccess(data));
      setSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

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
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const deleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const response = await fetch("/api/user/delete/" + currentUser._id, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const signOut = async () => {
    dispatch(signOutUserStart());
    try {
      const response = await fetch("/api/auth/signout");
      const data = await response.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const showlistingHandler = async () => {
    try {
      setShowListingLoading(true);
      setShowListingError(false);
      const response = await fetch("/api/user/listings/" + currentUser._id);
      const data = await response.json();
      if (data.success === false) {
        setShowListingError(data.message);
        setShowListingLoading(false);
        return;
      }
      setListings(data);
      setShowListingLoading(false);
    } catch (error) {
      setShowListingError(error.message);
      setShowListingLoading(false);
    }
  };

  const deleteListingHandler = async (listingId) => {
    try {
      const response = await fetch("/api/listing/delete/" + listingId, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center justify-center h-full">
      <h2 className="text-4xl font-semibold mt-20">Profile</h2>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 m-4 sm:w-96 h-fit"
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
          onClick={() => fileRef.current.click()}
          className="self-center rounded-full mb-4 mx-auto cursor-pointer h-24 w-24"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-sm text-red-500 font-semibold">
              Error Image Upload
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700 text-sm font-semibold">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-sm text-green-700 font-semibold">
              Image successfully Uploaded
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={loading}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
        <Link
          to="/create-listing"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block mt-2.5 text-center"
        >
          Create Listing
        </Link>
        {error && <div className="text-xs text-red-500 my-2.5">{error}</div>}
        {success && (
          <div className="text-xs text-green-700 my-2.5">
            User is Updated Successfully
          </div>
        )}
        <div className="flex items-center justify-between mt-2.5 text-red-500 font-semibold">
          <div className="cursor-pointer" onClick={deleteUser}>
            Delete Account
          </div>
          <div className="cursor-pointer" onClick={signOut}>
            Sign Out
          </div>
        </div>
      </form>
      <button
        disabled={showListingLoading}
        className="text-green-700 font-semibold"
        onClick={showlistingHandler}
      >
        {showListingLoading ? "Lisitng Loading..." : "Show Listing"}
      </button>
      {showListingError && (
        <p className="text-red-700 font-semibold mt-1.5">
          Error in showing Listings
        </p>
      )}

      {listings && listings.length > 0 && (
        <div className="text-3xl font-semibold pb-4">Your Listings</div>
      )}
      {listings &&
        listings.length > 0 &&
        listings.map((listing) => (
          <div
            key={listing._id}
            className="w-full sm:w-96 flex items-center justify-between gap-4 p-3 mb-1.5 border rounded"
          >
            <img
              src={listing.imageUrls[0]}
              alt="image listing"
              className="w-20 object-contain"
            />
            <Link
              to={`/listing/${listing._id}`}
              className="text-sm font-semibold text-left hover:underline truncate"
            >
              {listing.name}
            </Link>
            <div className="flex flex-col gap-2">
              <button className="text-green-700 font-semibold text-sm">
                Edit
              </button>
              <button
                className="text-red-700 font-semibold text-sm"
                onClick={() => deleteListingHandler(listing._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Profile;
