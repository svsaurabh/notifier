const axios = require('axios');
const dateformat = require('dateformat');
const schedule = require('node-schedule');
const got = require('got');

const getStates = async (district, currentDate) => {
  try {
    axios({
      method: 'get',
      url: `https://cdn-api.co-vin.in/api/v2/admin/location/states`,
      headers: { accept: 'application/json' },
    }).then((response) => {
      console.log(response);
      // let data = response.data.sessions;
      // data = data.filter((center) => {
      //   return center.available_capacity_dose1 > 0 ? true : false;
      // });
      // console.log(data.length);
    });
  } catch (err) {
    console.log('Error :', err);
  }
};
// runs every minutes with cron expression
// const job = schedule.scheduleJob('* * * * * *', () => {
//   getStates('664', dateformat(new Date(), 'dd-mm-yyyy'));
// });

(async () => {
  console.log(await got.get('https://cdn-api.co-vin.in/api/v2/admin/location/states'));
})();
