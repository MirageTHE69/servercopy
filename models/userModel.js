const
    mongoose = require('mongoose'),
    capitalize = require('../utils/capitalize');

const userSchema = new mongoose.Schema({
    name: String,

    email: String,

    address: {
        type: [String]
    },

    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        unique: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }
});

userSchema.pre('save', async function (next) {
    this.name = capitalize(this.name);
    next();
});

module.exports = mongoose.model('User', userSchema);