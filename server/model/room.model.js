import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    number: { type: String, required: true, unique: true },
    description: String,
    status: {
        type: String,
        enum: ['Available', 'Booked', 'Maintenance'],
        default: 'Available',
    },
    category: {
        type: String,
        enum: ['Standard', 'Deluxe', 'Suite'],
        required: true,
    },
    images: [String],
    amenities: [String],
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Room', roomSchema);
