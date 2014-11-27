// Module for SR event
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user');
var moment = require('moment');
    moment.locale('is');

var eventSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'user' }, // userId eigandan atburðs
  title: { type: String }, // t.d. Kafli 19.3
  courseName: { type: String }, // t.d. NÁT123
  dateAdded: { type: Date }, // dagurinn sem glósurnar voru teknar
  glossaryLocation: { type: String }, // t.d. bókin sem glósurnar eru í
  reviewCount: { type: Number }, // hve oft hann hefur skoðað glósurnar
  nextReviewDate: { type: Date } // næsti dagur sem hann skal fara yfir glósurnar
});

eventSchema.methods.updateReviewDate = function (callback) {
  var incReviewCount = this.reviewCount + 1;
  var updatedReviewDate = moment(this.nextReviewDate);
  switch (incReviewCount) {
    case 1:
      updatedReviewDate.add(1, 'months');
      break;
    case 2:
      updatedReviewDate.add(2, 'months');
      break;
    case 3:
      updatedReviewDate.add(3, 'months');
      break;
    case 4:
      updatedReviewDate.add(6, 'months');
      break;
    case 5:
      updatedReviewDate.add(8, 'months');
      break;
    default:
      updatedReviewDate.add(1, 'years');
  }

  eventModel.update({_id: this._id}, {
    $set: {reviewCount: incReviewCount,
           nextReviewDate: updatedReviewDate.toDate()}
    }, function (err) {
      if (err) {
        return callback("Couldn't update review date", null);
      }
    });
  return callback(null, updatedReviewDate.toDate());
}

eventModel = mongoose.model('Event', eventSchema, 'eventcollection');

module.exports = eventModel;