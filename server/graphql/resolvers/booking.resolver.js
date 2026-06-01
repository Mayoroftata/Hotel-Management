import Booking from "../../model/booking.model.js";
import Room from "../../model/room.model.js";
import { requireAdmin } from "../../utils/auth.js";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const bookingResolvers = {
  Query: {
    getAllBookings: async (_, __, { user }) => {
      requireAdmin(user); // Only admins can access all bookings
      return await Booking.find().populate("room");
    },

    getBookingById: async (_, { id }, { user }) => {
      const booking = await Booking.findById(id).populate("room", "user");
      if (!booking) throw new Error("Booking not found");

      const isOwner = booking.user?.toString() === user?.id;
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized to view this booking");
      }

      return booking;
    },
  },

  Mutation: {
    createBooking: async (_, { input }, { user }) => {
      try {
        const checkIn = new Date(input.checkIn);
        const checkOut = new Date(input.checkOut);

        if (checkIn >= checkOut) {
          throw new Error("Check-out date must be after check-in date");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkInDate = new Date(checkIn);
        checkInDate.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
          throw new Error("Check-in date cannot be in the past");
        }

        const room = await Room.findById(input.room);
        if (!room) {
          throw new Error("Room not found");
        }

        if (!room.isAvailable) {
          throw new Error("No available space for now");
        }

        const existingBooking = await Booking.findOne({
          room: input.room,
          status: { $ne: "CANCELLED" },
          $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
        });

        if (existingBooking) {
          throw new Error("Room is already booked for these dates");
        }

        const booking = new Booking({
          ...input,
          user: user.id,
          totalPrice: input.totalPrice ?? 0,
          status: "CONFIRMED",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedBooking = await booking.save();
        return await Booking.populate(savedBooking, "room");
      } catch (error) {
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map((e) => e.message);
          throw new Error(`Validation failed: ${messages.join(", ")}`);
        }
        throw new Error(error.message || "Booking creation failed");
      }
    },

    updateBooking: async (_, { id, input }, { user }) => {
      const booking = await Booking.findById(id);
      if (!booking) throw new Error("Booking not found");

      const isOwner = booking.user?.toString() === user?.id;
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized to update this booking");
      }

      const nextCheckIn = input.checkIn ? new Date(input.checkIn) : booking.checkIn;
      const nextCheckOut = input.checkOut
        ? new Date(input.checkOut)
        : booking.checkOut;

      if (nextCheckIn >= nextCheckOut) {
        throw new Error("Check-out date must be after check-in date");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkInDate = new Date(nextCheckIn);
      checkInDate.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        throw new Error("Check-in date cannot be in the past");
      }

      const updatedBooking = await Booking.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
        context: "query",
      }).populate("room");

      return updatedBooking;
    },

    deleteBooking: async (_, { id }, { user }) => {
      requireAdmin(user); // Only admin can delete bookings

      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) throw new Error("Booking not found");

      return "Booking deleted successfully";
    },

    cancelBooking: async (_, { id, reason }, { user }) => {
      const booking = await Booking.findById(id);
      if (!booking) throw new Error("Booking not found");

      if (booking.status === "CANCELLED") {
        throw new Error("Booking is already cancelled");
      }

      const isOwner = booking.user?.toString() === user?.id;
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized to cancel this booking");
      }

      const isBeforeCheckout = new Date() < new Date(booking.checkOut);
      if (isBeforeCheckout && !reason?.trim()) {
        throw new Error("Cancellation reason is required before check-out date");
      }

      const cancelledBooking = await Booking.findByIdAndUpdate(
        id,
        {
          status: "CANCELLED",
          cancellationReason: reason?.trim() || "Cancelled after check-out date",
          cancelledAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true },
      ).populate("room");

      return cancelledBooking;
    },

    createPaymentIntent: async (_, { amount }) => {
      // Mock implementation - replace with actual Stripe integration
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: amount * 100, // Stripe expects amount in cents
      //   currency: "usd",
      // });

      // return {
      //   clientSecret: paymentIntent.client_secret,
      // };

      // Mock response
      return {
        clientSecret: "mock_client_secret_" + Date.now(),
      };
    },
  },

  Booking: {
    id: (booking) => booking._id.toString(),
    checkIn: (booking) => booking.checkIn?.toISOString(),
    checkOut: (booking) => booking.checkOut?.toISOString(),
    createdAt: (booking) => booking.createdAt?.toISOString(),
    cancelledAt: (booking) => booking.cancelledAt?.toISOString(),
  },
};

export default bookingResolvers;
