const mongoose = require('mongoose');

const controlsSchema = new mongoose.Schema({
    messageEmail: { type: String },
    messageEmailContent: { type: String },
    approvalEmail: { type: String },
    approvalEmailContent: { type: String },
}, {
    timestamps: true
});

const Controls = mongoose.model('Controls', controlsSchema);

module.exports = Controls;