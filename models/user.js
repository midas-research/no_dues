const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String
    },
    degree: {
        type: String,
        enum: ['B. Tech', 'M. Tech', 'PHD']
    },
    startYear: {
        type: Number
    },
    designLab: {
        type: Boolean,
        default: false,
        required: true
    },
    library: {
        type: Boolean,
        default: false,
        required: true
    },
    adminFacilities: {
        type: Boolean,
        default: false,
        required: true
    },
    systemAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    sports: {
        type: Boolean,
        default: false,
        required: true
    },
    hostel: {
        type: Boolean,
        default: false,
        required: true
    },
    eceLabs: {
        type: Boolean,
        default: false,
        required: true
    },
    placement: {
        type: Boolean,
        default: false,
        required: true
    },
    incubation: {
        type: Boolean,
        default: false,
        required: true
    },
    finance: {
        type: Boolean,
        default: false,
        required: true
    },
    academics: {
        type: Boolean,
        default: false,
        required: true
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;