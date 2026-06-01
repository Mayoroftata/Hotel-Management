import Room from "../../model/room.model.js";
import { requireAdmin } from "../../utils/auth.js";

const roomResolvers = {
  Query: {
    getAllRooms: async () => {
      try {
        return await Room.find();
      } catch (error) {
        throw new Error("Failed to fetch rooms");
      }
    },
    getRoomById: async (_, { id }) => {
      try {
        const room = await Room.findById(id);
        if (!room) throw new Error("Room not found");
        return room;
      } catch (error) {
        throw new Error(error.message || "Failed to fetch room");
      }
    },
    getRoomsByCategory: async (_, { category }) => {
      try {
        const rooms = await Room.find({ category });
        return rooms || [];
      } catch (error) {
        throw new Error(error.message || "Failed to fetch rooms by category");
      }
    },
  },
  Mutation: {
    createRoom: async (_, { input }, { user }) => {
      try {
        requireAdmin(user); // ✅ Admin check

        if (!input.number) throw new Error("Room number is required");

        const existingRoom = await Room.findOne({ number: input.number });
        if (existingRoom) throw new Error("Room number must be unique");

        const room = new Room(input);
        return await room.save();
      } catch (error) {
        throw new Error(error.message || "Failed to create room");
      }
    },

    updateRoom: async (_, { id, input }, { user }) => {
      try {
        requireAdmin(user); // ✅ Admin check

        if (input.number) {
          const existingRoom = await Room.findOne({ number: input.number });
          if (existingRoom && existingRoom._id.toString() !== id) {
            throw new Error("Room number must be unique");
          }
        }

        const updatedRoom = await Room.findByIdAndUpdate(
          id,
          { ...input, updatedAt: new Date() },
          { new: true },
        );

        if (!updatedRoom) throw new Error("Room not found");
        return updatedRoom;
      } catch (error) {
        throw new Error(error.message || "Failed to update room");
      }
    },

    deleteRoom: async (_, { id }, { user }) => {
      try {
        requireAdmin(user); // ✅ Admin check

        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) throw new Error("Room not found");
        return "Room deleted successfully";
      } catch (error) {
        throw new Error(error.message || "Failed to delete room");
      }
    },
    updateRoomAvailability: async (_, { id, isAvailable }, { user }) => {
      try {
        requireAdmin(user);

        const updatedRoom = await Room.findByIdAndUpdate(
          id,
          { isAvailable, updatedAt: new Date() },
          { new: true },
        );

        if (!updatedRoom) throw new Error("Room not found");
        return updatedRoom;
      } catch (error) {
        throw new Error(error.message || "Failed to update room availability");
      }
    },
  },
  Room: {
    id: (room) => room._id.toString(),
  },
};

export default roomResolvers;
