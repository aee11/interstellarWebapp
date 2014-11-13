var mongoose = require('mongoose');
var dbUri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/interstellar';
mongoose.connect(dbUri);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connection to db established");
});

module.exports = db;