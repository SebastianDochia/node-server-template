const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stringify } = require('querystring');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: [true, 'Email already registered'],
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Entered email is invalid'
        ]
    },
    role: {
        type: String,
        enum: ['student', 'professor'],
        default: 'student'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    lastOutput: String,
    lastOutput: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function() {
     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
     });
};

// Match user entered password to hashed password in DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate password token and hash it
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);