const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    user_id: { type: Number, ref: 'User' },
    createdAt: Date,
},
    {
        collection: 'carts'
    });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart };