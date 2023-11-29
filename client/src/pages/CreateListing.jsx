import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedRooms: 1,
    bathRooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError(false);
      setImageUploadLoading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setImageUploadLoading(false);
        })
        .catch((error) => {
          setImageUploadError(`Image upload failed ( 2 mb max per image')`);
          setImageUploadLoading(false);
        });
    } else {
      setImageUploadError("You can upload 6 images per listing");
      setImageUploadLoading(false);
    }
  };

  const storageImage = async (file) => {
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
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "sale" || e.target.name === "rent") {
      setFormData({
        ...formData,
        type: e.target.name,
      });
    } else if (
      e.target.name === "parking" ||
      e.target.name === "furnished" ||
      e.target.name === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      return setErrorForm("You must upload at least one image");
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      return setErrorForm("Discount price must be lower than discount price");
    }
    try {
      setLoadingForm(true);
      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await response.json();
      if (data.success === false) {
        setLoadingForm(false);
        setErrorForm(data.message);
      }
      setLoadingForm(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoadingForm(false);
      setErrorForm(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center flex-col p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Add New Listing</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-96 bg-white p-6 rounded-md shadow-md mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded-md px-4 py-2 w-full"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded-md px-4 py-2 w-full"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="border rounded-md px-4 py-2 w-full"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-start flex-wrap gap-3">
          <div className="mb-4 flex gap-2">
            <input
              type="checkbox"
              id="sale"
              name="sale"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Sell
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input
              type="checkbox"
              id="rent"
              name="rent"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Rent
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input
              type="checkbox"
              id="parking"
              name="parking"
              onChange={handleChange}
              checked={formData.parking}
            />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Parking Spot
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input
              type="checkbox"
              id="furnished"
              name="furnished"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Furnished
            </label>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="checkbox"
            id="offer"
            name="offer"
            onChange={handleChange}
            checked={formData.offer}
          />
          <label
            htmlFor="offer"
            className="block text-gray-700 text-sm font-bold"
          >
            Offer
          </label>
        </div>

        <div className="flex gap-2.5">
          <div className="mb-4">
            <label
              htmlFor="regularPrice"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Regular Price
            </label>
            <input
              type="number"
              min={0}
              id="regularPrice"
              name="regularPrice"
              className="border rounded-md px-4 py-2 w-full"
              value={formData.regularPrice}
              onChange={handleChange}
            />
          </div>

          {formData.offer && (
            <div className="mb-4">
              <label
                htmlFor="discountPrice"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Discount Price
              </label>
              <input
                type="number"
                min={0}
                id="discountPrice"
                name="discountPrice"
                className="border rounded-md px-4 py-2 w-full"
                value={formData.discountPrice}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2.5">
          <div className="mb-4">
            <label
              htmlFor="bathRooms"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Bathrooms
            </label>
            <input
              type="number"
              min={0}
              id="bathRooms"
              name="bathRooms"
              className="border rounded-md px-4 py-2 w-full"
              value={formData.bathRooms}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="bedRooms"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Bedrooms
            </label>
            <input
              type="number"
              min={0}
              id="bedRooms"
              name="bedRooms"
              className="border rounded-md px-4 py-2 w-full"
              value={formData.bedRooms}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            className="border rounded-md px-4 py-2 w-full"
            value={formData.type}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <div className="text-sm">
            <span className="font-bold">Images:</span> First Image will be cover
            photo and max 6
          </div>
          <div className="flex gap-2.5 my-2">
            <input
              type="file"
              id="imageUrls"
              name="imageUrls"
              multiple
              className="border p-1.5 rounded cursor-pointer"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              className="border-green-700 border py-1 px-3 rounded text-green-700 outline-none"
              onClick={handleImageSubmit}
            >
              {imageUploadLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-500 font-semibold text-sm mt-1.5">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((image, index) => (
              <div
                className="flex items-center justify-between border px-3 mb-2 rounded"
                key={index}
              >
                <img
                  src={image}
                  alt="listing-image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="text-red-700 font-semibold"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            disabled={loadingForm || imageUploadLoading}
            type="submit"
            className="w-full bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 mt-4 uppercase"
          >
            {loadingForm ? "Loading..." : "Add Listing"}
          </button>
        </div>
        {errorForm && (
          <p className="text-red-700 mt-1.5 font-semibold">{errorForm}</p>
        )}
      </form>
    </div>
  );
}
