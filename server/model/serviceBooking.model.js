import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: String,
    phone: String,
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    serviceType: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    notes: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ServiceBooking", serviceBookingSchema);
