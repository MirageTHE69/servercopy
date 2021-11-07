const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A product must have a title'],
        unique: true
    },

    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },

    image: {
        type: String,
        required: [true, 'A product must have an image']
    }
});

module.exports = mongoose.model('Product', productSchema);