const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.connect('mongodb://localhost:27017/FreshStock', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (e) => console.error(e));
db.once('open', function () {
    console.log('Mongoose connected');
});

module.exports = { db, mongoose, ObjectId };