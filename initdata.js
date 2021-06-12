const State = require('./models/state');
const District = require('./models/district');
const db = require('./models/index');
const axios = require('axios');
require('dotenv').config();

const initiateStates = async () => {
  try {
    const config = {
      headers: {
        accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
      },
    };
    const res = await axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`, config);
    for (let state of res.data.states) {
      let data = new State({
        state_id: state.state_id,
        state_name: state.state_name,
      });
      data.save();
    }
  } catch (err) {
    errData.unshift(state);
    console.log('Error :', state);
  }
};

let errData = [];
const main = async () => {
  await initiateStates();
  await db.connectDB();
  let states = await State.find();
  for (let state of states) {
    await new Promise((resolve) => {
      return setTimeout(resolve, 1000);
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
          state_id: state,
        });
        data.save();
      }
    } catch (err) {
      errData.unshift(state);
      console.log('Error :', state);
    }
  }
  console.log(errData);
  await new Promise((resolve) => {
    return setTimeout(resolve, 5000);
  });
  await db.disconnectDB();
};

main();
