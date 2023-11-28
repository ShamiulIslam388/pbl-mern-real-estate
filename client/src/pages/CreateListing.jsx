import React, { useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  console.log(formData);

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

  return (
    <div className="w-full flex justify-center flex-col p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Add New Listing</h1>

      <form
        action="/add-listing"
        method="post"
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
          />
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
            />
          </div>

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
            />
          </div>
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
            />
          </div>
        </div>

        <div className="flex items-start flex-wrap gap-3">
          <div className="mb-4 flex gap-2">
            <input type="checkbox" id="sale" name="sale" />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Sell
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input type="checkbox" id="rent" name="rent" />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Rent
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input type="checkbox" id="parking" name="parking" />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Parking Spot
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <input type="checkbox" id="furnished" name="furnished" />
            <label
              htmlFor="parking"
              className="block text-gray-700 text-sm font-bold"
            >
              Furnished
            </label>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <input type="checkbox" id="offer" name="offer" />
          <label
            htmlFor="offer"
            className="block text-gray-700 text-sm font-bold "
          >
            Offer
          </label>
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
            type="submit"
            className="w-full bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 mt-4 uppercase"
          >
            Add Listing
          </button>
        </div>
      </form>
    </div>
  );
}
