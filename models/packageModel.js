const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: [true, 'A package must belong to a service']
    },

    title: {
        type: String,
        required: [true, 'A package must have a title']
    },

    price: {
        type: Number,
        required: [true, 'A package must have a price']
    },

    points: {
        type: [String],
        default: []
    }
});

packageSchema.pre('save', function (next) {
    if (!this.points.length)
        this.points = undefined;

    next();
});

module.exports = mongoose.model('Package', packageSchema);