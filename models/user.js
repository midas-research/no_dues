const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true, unique: true },
    branch: { type: String, required: true, default: 'btech' },
    degree: { type: String, enum: ['B. Tech', 'M. Tech', 'PhD'] },
    startYear: { type: Number },
    type: {type: String},
    department: { type: String },

    designLab: { type: Boolean },
    library: { type: Boolean },
    adminFacilities: { type: Boolean },
    systemAdmin: { type: Boolean },
    sports: { type: Boolean },
    hostel: { type: Boolean },
    eceLabs: { type: Boolean },
    placement: { type: Boolean },
    incubation: { type: Boolean },
    finance: { type: Boolean },
    academics: { type: Boolean },
    ip: { type: String },
    btp: { type: String },
    
    designLabAppliedAt: { type: Date },
    libraryAppliedAt: { type: Date },
    adminFacilitiesAppliedAt: { type: Date },
    systemAdminAppliedAt: { type: Date },
    sportsAppliedAt: { type: Date },
    hostelAppliedAt: { type: Date },
    eceLabsAppliedAt: { type: Date },
    placementAppliedAt: { type: Date },
    incubationAppliedAt: { type: Date },
    financeAppliedAt: { type: Date },
    academicsAppliedAt: { type: Date },

    designLabApprovedAt: { type: Date },
    libraryApprovedAt: { type: Date },
    adminFacilitiesApprovedAt: { type: Date },
    systemAdminApprovedAt: { type: Date },
    sportsApprovedAt: { type: Date },
    hostelApprovedAt: { type: Date },
    eceLabsApprovedAt: { type: Date },
    placementApprovedAt: { type: Date },
    incubationApprovedAt: { type: Date },
    financeApprovedAt: { type: Date },
    academicsApprovedAt: { type: Date },

    designLabMessage: { type: String },
    libraryMessage: { type: String },
    adminFacilitiesMessage: { type: String },
    systemAdminMessage: { type: String },
    sportsMessage: { type: String },
    hostelMessage: { type: String },
    eceLabsMessage: { type: String },
    placementMessage: { type: String },
    incubationMessage: { type: String },
    financeMessage: { type: String },
    academicsMessage: { type: String },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;