const axios = require('axios');
const dateformat = require('dateformat');
const schedule = require('node-schedule');
const got = require('got');
const ProxyList = require('free-proxy');
const proxyList = new ProxyList();
let proxies;

const getStates = async (district, currentDate) => {
  try {
    axios({
      method: 'get',
      url: `https://cdn-api.co-vin.in/api/v2/admin/location/states`,
      headers: {
        accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
      },
    }).then((response) => {
      console.log(response.data.states);
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
  getStates('664', dateformat(new Date(), 'dd-mm-yyyy'));
  // await got.get('https://cdn-api.co-vin.in/api/v2/admin/location/states').then((resp) => {
  //   console.log(resp.body);
  // });
})();
