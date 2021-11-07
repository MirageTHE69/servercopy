const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'An order must belong to a product']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An order must belong to a product']
    },

    quantity: {
        type: Number,
        required: [true, 'An order must have a quantity']
    },

    totalPrice: Number
});

orderSchema.pre('save', async function (next) {
    await this.populate({ path: 'product', select: 'title price' }).execPopulate();
    this.totalPrice = this.quantity * this.price;
    next();
});


module.exports = mongoose.model('Order', orderSchema);