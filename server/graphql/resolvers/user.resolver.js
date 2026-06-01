import jwt from "jsonwebtoken";
import User from "../../model/user.model.js";
import { getJwtSecret } from "../../utils/auth.js";

const SECRET = getJwtSecret();

const generateToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, SECRET, { expiresIn: "7d" });

const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await User.findById(user._id);
    },
    getProfile: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await User.findById(user._id);
    },
  },
  Mutation: {
    register: async (_, { input }) => {
      const existing = await User.findOne({ email: input.email });
      if (existing) throw new Error("Email already in use");
      const user = new User(input);
      await user.save();
      return {
        token: generateToken(user),
        user,
      };
    },
    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user || !(await user.comparePassword(input.password))) {
        throw new Error("Invalid credentials");
      }
      return {
        token: generateToken(user),
        user,
      };
    },
    updateProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      if (input.email) {
        const existing = await User.findOne({
          email: input.email,
          _id: { $ne: user._id },
        });
        if (existing) {
          throw new Error("Email already in use");
        }
      }

      const updates = {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
      };

      return await User.findByIdAndUpdate(user._id, updates, {
        new: true,
        runValidators: true,
      });
    },
  },
};

export default userResolvers;
