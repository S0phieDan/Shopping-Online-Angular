const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const orderSchema = new Schema({
    user_id: {type: Number, ref: 'User'},
    cart_id: {type: ObjectId},
    totalPrice: Number,
    city: String,
    street: String,
    shippingDate: String,
    paymentMethod: String,
    createdAt: Date
},
{
    collection: 'orders'
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };