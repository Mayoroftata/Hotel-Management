// fix-rooms.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "./model/room.model.js";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const fixRoomNames = async () => {
  try {
    // Connect to MongoDB with proper options
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ Connected to MongoDB successfully!");
    
    // Find rooms with null or empty names
    const roomsWithNullNames = await Room.find({
      $or: [
        { name: null },
        { name: "" },
        { name: { $exists: false } }
      ]
    });
    
    console.log(`📊 Found ${roomsWithNullNames.length} rooms with missing names`);
    
    if (roomsWithNullNames.length === 0) {
      console.log("✨ No rooms need fixing!");
      await mongoose.disconnect();
      return;
    }
    
    // Update rooms with missing names
    let updatedCount = 0;
    for (const room of roomsWithNullNames) {
      const oldName = room.name;
      room.name = `Room ${room._id.toString().slice(-6)}`;
      await room.save();
      updatedCount++;
      console.log(`✅ Updated room ${room._id}: "${oldName || 'null'}" → "${room.name}"`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} rooms!`);
    
    // Verify the fix
    const remainingIssues = await Room.find({
      $or: [{ name: null }, { name: "" }, { name: { $exists: false } }]
    });
    
    if (remainingIssues.length === 0) {
      console.log("✅ All rooms now have valid names!");
    } else {
      console.log(`⚠️ ${remainingIssues.length} rooms still have issues`);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the fix
fixRoomNames();