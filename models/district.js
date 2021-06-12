const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const districtSchema = new Schema({
  district_id: {
    type: Number,
    required: true,
  },
  district_name: {
    type: String,
    required: true,
  },
  state_id: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  is_telegram: {
    type: Boolean,
    default: false,
  },
  telegram_channel_name: {
    type: String,
    default: null,
  },
  telegram_channel_id: {
    type: String,
    default: null,
  },
});

module.exports = District = mongoose.model('district', districtSchema);
