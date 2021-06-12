const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    state_id:{
        type: Number,
        required: true
    },
    state_name:{
        type: String,
        required: true
    }
})

module.exports = State = mongoose.model('state', stateSchema)