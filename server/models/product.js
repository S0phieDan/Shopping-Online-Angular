const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const productSchema = new Schema({
    name: String,
    category_id: { type: ObjectId, ref: 'Category' },
    price: Number,
    image: String
},
    {
        collection: 'products',
    });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };