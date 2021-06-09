const axios = require('axios');
const dateformat = require('dateformat');
const schedule = require('node-schedule');
const https = require('https')
const agent = new https.Agent({
  rejectUnauthorized: false
});

const getStates = async (district, currentDate) => {
  try {
    let response = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${currentDate}`,
      {
        httpsAgent: agent,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
        },
      }
    );
      console.log(JSON.stringify(response.data.sessions.length));
      let data = response.data.sessions;
      data = data.filter((center) => {
        return center.available_capacity_dose1 > 0 ? true : false;
      });
      console.log(data.length);
  } catch (err) {
    console.log('Error :', err);
  }
};
// runs every minutes with cron expression
// const job = schedule.scheduleJob('0 * * * * *', () => {
//   getStates('664', dateformat(new Date(), 'dd-mm-yyyy'));
// });
getStates('664', dateformat(new Date(), 'dd-mm-yyyy'));