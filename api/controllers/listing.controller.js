const Listing = require("../models/listing.model");
const { errorHandler } = require("../utils/error");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "No listing found"));
    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "Unauthorized user"));
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "listing is deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createListing, deleteListing };
