import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: String,
    capacity: Number,
    cuisine: String,
    priceRange: String,
    openingHours: String,
    duration: String,
    maxCapacity: Number,
    images: [String],
    category: {
      type: String,
      required: true,
      enum: [
        "Housekeeping",
        "Concierge",
        "Wellness",
        "Dining",
        "Transportation",
        "Other",
        "Conferences",
        "Weddings",
        "Corporate Events",
        "Restaurants",
        "Recreation",
        "Fitness",
        "Spa",
        "Sports",
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Service", serviceSchema);
