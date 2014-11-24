// Module for User model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

//bcrypt middleware
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      console.log(hash);
      user.password = hash;
      next();
    });
  });
});

userSchema.post('save', function (doc) {
  console.log('%s has been saved.', doc.username);
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('user', userSchema, 'usercollection');