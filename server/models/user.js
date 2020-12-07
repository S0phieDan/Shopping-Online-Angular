const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: Number,
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    city: String,
    street: String,
    isAdmin: Boolean
},
    {
        collection: 'users',
    });

const User = mongoose.model('User', userSchema);

module.exports = { User };