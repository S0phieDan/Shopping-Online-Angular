const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const cartItemSchema = new Schema({
    product_id: {type: ObjectId, ref: 'Product'},
    quantity: Number,
    price:Number,
    cart_id: {type: ObjectId, ref: 'Cart'},
},
{
    collection: 'cartItems'
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = { CartItem };