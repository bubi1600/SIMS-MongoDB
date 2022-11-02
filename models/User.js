const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true, unique: false },
        //dateOfBirth: { type: Date, required: false, unique: false }
    }
);

module.exports = mongoose.model('User', UserSchema);
