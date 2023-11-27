import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [success, setSuccess] = useState(false);

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
          <div className="cursor-pointer">Sign Out</div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
