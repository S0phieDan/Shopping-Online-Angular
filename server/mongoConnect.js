const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.connect('mongodb+srv://root:Aa123456!@forever.uos9c.mongodb.net/FreshStock?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (e) => console.error(e));
db.once('open', function () {
    console.log('Mongoose connected');
});

module.exports = { db, mongoose, ObjectId };