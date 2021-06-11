const mongoose = require('mongoose');
const State = require('./models/state');
const District = require('./models/district');
const axios = require('axios');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.nf8mx.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

let errData = [];
async function main() {
  let states = await State.find();
  for (let state of states) {
    await new Promise((resolve) => {
      return setTimeout(resolve, 5000);
    });
    try {
      const config = {
        headers: {
          accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
        },
      };
      const res = await axios.get(
        `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state.state_id}`,
        config
      );
      for (let district of res.data.districts) {
        let data = new District({
          district_id: district.district_id,
          district_name: district.district_name,
          state_id: state._id,
        });
        data.save();
      }
    } catch (err) {
      errData.unshift(state);
      console.log('Error :', state);
    }
  }
  console.log(errData);
  await disconnectDB();
}

main();
