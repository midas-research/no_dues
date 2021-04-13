const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true, unique: true },
    department: { type: String }
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', userSchema);

module.exports = Admin;