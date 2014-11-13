// Module for SR event
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var eventSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'user' }, // userId eigandan atburðs
  title: { type: String }, // t.d. Kafli 19.3
  courseName: { type: String }, // t.d. NÁT123
  dateAdded: { type: Date }, // dagurinn sem glósurnar voru teknar
  glossaryLocation: { type: String }, // t.d. bókin sem glósurnar eru í
  reviewCount: { type: Number }, // hve oft hann hefur skoðað glósurnar
  nextReviewDate: { type: Date } // næsti dagur sem hann skal fara yfir glósurnar
});

eventSchema.methods.reviewCountIncr = function (callback) {
  return false;
}
eventSchema.methods.updateReviewDate = function (callback) {
  return false;
}

eventModel = mongoose.model('Event', eventSchema, 'eventcollection');

module.exports = eventModel;