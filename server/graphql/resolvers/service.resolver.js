import Service from "../../model/service.model.js";
import ServiceBooking from "../../model/serviceBooking.model.js";
import { requireAdmin } from "../../utils/auth.js";

const meetingCategories = ["Conferences", "Weddings", "Corporate Events"];
const diningCategories = ["Dining", "Restaurants"];
const recreationCategories = ["Recreation", "Fitness", "Spa", "Sports"];

const toMeetingServiceInput = (input) => ({
  name: input.title,
  description: input.description || "",
  price: input.price,
  category: input.type,
  type: input.type,
  capacity: input.capacity,
  images: input.images || [],
  isAvailable: input.isAvailable,
});

const toDiningServiceInput = (input) => ({
  name: input.name,
  description: input.description || "",
  price: 0,
  category: "Dining",
  cuisine: input.cuisine,
  priceRange: input.priceRange,
  openingHours: input.openingHours,
  isAvailable: input.isAvailable,
});

const toRecreationServiceInput = (input) => ({
  name: input.name,
  description: input.description || "",
  price: input.price,
  category: input.category,
  duration: input.duration,
  maxCapacity: input.maxCapacity,
  images: input.images || [],
  isAvailable: input.isAvailable,
});

const serviceResolvers = {
  Query: {
    getAllServices: async () => {
      try {
        return await Service.find();
      } catch (error) {
        throw new Error("Failed to fetch services");
      }
    },
    getServiceById: async (_, { id }) => {
      try {
        const service = await Service.findById(id);
        if (!service) throw new Error("Service not found");
        return service;
      } catch (error) {
        throw new Error(error.message || "Failed to fetch service");
      }
    },
    getServicesByCategory: async (_, { category }) => {
      try {
        const services = await Service.find({ category });
        return services || [];
      } catch (error) {
        throw new Error(
          error.message || "Failed to fetch services by category",
        );
      }
    },
    getAllMeetingsEvents: async (_, __, { user }) => {
      requireAdmin(user);
      return await Service.find({ category: { $in: meetingCategories } });
    },
    getAllDining: async (_, __, { user }) => {
      requireAdmin(user);
      return await Service.find({ category: { $in: diningCategories } });
    },
    getAllRecreationActivities: async (_, __, { user }) => {
      requireAdmin(user);
      return await Service.find({ category: { $in: recreationCategories } });
    },
    getAllServiceBookings: async (_, __, { user }) => {
      requireAdmin(user);
      return await ServiceBooking.find().populate("service");
    },
    getServiceBookingById: async (_, { id }, { user }) => {
      requireAdmin(user);
      const booking = await ServiceBooking.findById(id).populate("service");
      if (!booking) throw new Error("Service booking not found");
      return booking;
    },
  },
  Mutation: {
    createService: async (_, { input }, { user }) => {
      try {
        requireAdmin(user); // Admin check

        const service = new Service(input);
        return await service.save();
      } catch (error) {
        throw new Error(error.message || "Failed to create service");
      }
    },

    updateService: async (_, { id, input }, { user }) => {
      try {
        requireAdmin(user); // Admin check

        const updatedService = await Service.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true },
        );

        if (!updatedService) throw new Error("Service not found");
        return updatedService;
      } catch (error) {
        throw new Error(error.message || "Failed to update service");
      }
    },

    deleteService: async (_, { id }, { user }) => {
      try {
        requireAdmin(user); // Admin check

        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) throw new Error("Service not found");
        return "Service deleted successfully";
      } catch (error) {
        throw new Error(error.message || "Failed to delete service");
      }
    },
    createMeetingEvent: async (_, { input }, { user }) => {
      requireAdmin(user);
      const service = new Service(toMeetingServiceInput(input));
      return await service.save();
    },
    updateMeetingEvent: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      const service = await Service.findByIdAndUpdate(
        id,
        { ...toMeetingServiceInput(input), updatedAt: new Date() },
        { new: true },
      );
      if (!service) throw new Error("Meeting/event not found");
      return service;
    },
    deleteMeetingEvent: async (_, { id }, { user }) => {
      requireAdmin(user);
      const service = await Service.findByIdAndDelete(id);
      if (!service) throw new Error("Meeting/event not found");
      return "Meeting/event deleted successfully";
    },
    createDining: async (_, { input }, { user }) => {
      requireAdmin(user);
      const service = new Service(toDiningServiceInput(input));
      return await service.save();
    },
    updateDining: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      const service = await Service.findByIdAndUpdate(
        id,
        { ...toDiningServiceInput(input), updatedAt: new Date() },
        { new: true },
      );
      if (!service) throw new Error("Dining option not found");
      return service;
    },
    deleteDining: async (_, { id }, { user }) => {
      requireAdmin(user);
      const service = await Service.findByIdAndDelete(id);
      if (!service) throw new Error("Dining option not found");
      return "Dining option deleted successfully";
    },
    createRecreationActivity: async (_, { input }, { user }) => {
      requireAdmin(user);
      const service = new Service(toRecreationServiceInput(input));
      return await service.save();
    },
    updateRecreationActivity: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      const service = await Service.findByIdAndUpdate(
        id,
        { ...toRecreationServiceInput(input), updatedAt: new Date() },
        { new: true },
      );
      if (!service) throw new Error("Recreation activity not found");
      return service;
    },
    deleteRecreationActivity: async (_, { id }, { user }) => {
      requireAdmin(user);
      const service = await Service.findByIdAndDelete(id);
      if (!service) throw new Error("Recreation activity not found");
      return "Recreation activity deleted successfully";
    },
    createServiceBooking: async (_, { input }) => {
      const booking = new ServiceBooking(input);
      return await booking.save();
    },
    updateServiceBooking: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      const booking = await ServiceBooking.findByIdAndUpdate(
        id,
        { ...input, updatedAt: new Date() },
        { new: true },
      ).populate("service");
      if (!booking) throw new Error("Service booking not found");
      return booking;
    },
    deleteServiceBooking: async (_, { id }, { user }) => {
      requireAdmin(user);
      const booking = await ServiceBooking.findByIdAndDelete(id);
      if (!booking) throw new Error("Service booking not found");
      return "Service booking deleted successfully";
    },
  },
  Service: {
    id: (service) => service._id.toString(),
  },
  MeetingEvent: {
    id: (service) => service._id.toString(),
    title: (service) => service.name,
    type: (service) => service.type || service.category,
  },
  Dining: {
    id: (service) => service._id.toString(),
    priceRange: (service) =>
      service.priceRange || (service.price ? `$${service.price}` : null),
  },
  RecreationActivity: {
    id: (service) => service._id.toString(),
  },
  ServiceBooking: {
    id: (booking) => booking._id.toString(),
    bookingDate: (booking) => booking.bookingDate?.toISOString(),
    createdAt: (booking) => booking.createdAt?.toISOString(),
  },
};

export default serviceResolvers;
