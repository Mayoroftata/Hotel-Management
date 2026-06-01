import roomTypeDefs from "./schema/room.schema.js";
import bookingTypeDefs from "./schema/booking.schema.js";
import userTypeDefs from "./schema/user.schema.js";
import serviceTypeDefs from "./schema/service.schema.js";
import roomResolvers from "./resolvers/room.resolver.js";
import bookingResolvers from "./resolvers/booking.resolver.js";
import userResolvers from "./resolvers/user.resolver.js";
import serviceResolvers from "./resolvers/service.resolver.js";

export const typeDefs = [
  roomTypeDefs,
  bookingTypeDefs,
  userTypeDefs,
  serviceTypeDefs,
];
export const resolvers = [
  roomResolvers,
  bookingResolvers,
  userResolvers,
  serviceResolvers,
];
