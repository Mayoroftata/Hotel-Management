import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"],
    },
    
    email: { type: String, unique: true, required: true },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    googleId: String,
    avatar: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    if (!password || !this.password) return false;
    return await bcrypt.compare(password, this.password);
};

// Virtual field for name (combines firstName and lastName)
userSchema.virtual('name').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual field for phone (maps phoneNumber)
userSchema.virtual('phone').get(function() {
    return this.phoneNumber;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
