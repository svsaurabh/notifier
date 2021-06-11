const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const districtSchema = new Schema({
    district_id:{
        type: Number,
        required: true
    },
    district_name:{
        type: String,
        required: true
    },
    state_id:{
        type: Schema.Types.ObjectId,
        ref: 'state'
    }

})

module.exports = District = mongoose.model('district', districtSchema)