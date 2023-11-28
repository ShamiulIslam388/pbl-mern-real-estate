import React from "react";

export default function CreateListing() {
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
            />
            <button
              type="button"
              className="border-green-700 border py-1 px-3 rounded text-green-700 outline-none"
            >
              Upload
            </button>
          </div>
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
