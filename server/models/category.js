const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    category_name: String,
},
{
    collection: 'categories'
});

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };