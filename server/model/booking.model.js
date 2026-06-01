import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  guestFirstName: {
    type: String,
    required: [true, "Guest First name is required"],
  },
  guestLastName: {
    type: String,
    require: [true, "Guest Last Name is required"],
  },
  guestEmail: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Room reference is required"],
  },
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"],
    validate: {
      validator: function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkInDate = new Date(value);
        checkInDate.setHours(0, 0, 0, 0);

        return checkInDate >= today;
      },
      message: "Check-in date cannot be in the past",
    },
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
    validate: {
      validator: function (value) {
        const update = this.getUpdate?.() || {};
        const checkIn = this.checkIn || update.checkIn || update.$set?.checkIn;

        if (!checkIn) return true;
        return new Date(value) > new Date(checkIn);
      },
      message: "Check-out date must be after check-in date",
    },
  },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED", "COMPLETED", "ERROR"],
    default: "CONFIRMED",
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  cancellationReason: String,
  cancelledAt: Date,
  specialRequests: String,

  // 🔐 Ownership field
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt field before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster room availability lookups
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
