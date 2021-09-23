const axios = require('axios');
const dateformat = require('dateformat');
const schedule = require('node-schedule');
const mail = require('./utilities/mail');
require('dotenv').config();

const notificationList = require('./utilities/notificationList');

let count = 1;
const districtExeStates = [];
let executionDistrict = {};

const changeState = (state, data) => {
  let val = state;
  console.log(
    'mailing to ' +
      data[0].district_name +
      data[0].min_age_limit +
      `changed from ${val} to ${data.length}`
  );
  val = data.length;
  mail.sendMail(data);
  return val;
};

const checkDataState = async (prevState, currentState, type) => {
  if (prevState && currentState.length > 0) {
    if (!prevState[type]) {
      prevState[type] = currentState;
      console.log(`New entry :${Object.keys(prevState)}`);
    } else if (prevState[type].length !== currentState.length) {
      console.log(`State changed prev :${prevState[type].length} current :${currentState.length}`);
      prevState[type] = currentState;
      mail.sendMail(currentState);
    } else {
      console.log('same data');
    }
  } else {
    console.log('No 18+ record Found');
  }
};

const notifyAvailableSlots = async (district, currentDate) => {
  try {
    axios({
      method: 'get',
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${currentDate}`,
      headers: {
        accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
      },
    }).then(async (response) => {
      let data = response.data.sessions;
      data = data.filter((center) => {
        return center.available_capacity > 0 ? true : false;
      });
      let data18 = [];
      let data45 = [];
      data.map((center) => {
        center.min_age_limit === 45 ? data45.push(center) : data18.push(center);
      });
      let prevState = districtExeStates.find((state) => state.district_id === district);
      if (!prevState) {
        districtExeStates.push({ district_id: district });
      }
      prevState = districtExeStates.find((state) => state.district_id === district);
      await checkDataState(prevState, data18, 'data18');
      prevState = districtExeStates.find((state) => state.district_id === district);
      await checkDataState(prevState, data45, 'data45');
    });
  } catch (err) {
    console.log('Error :', err);
  }
};

const fetchResponse = async () => {
  try {
    for (const execution of executionDistrict) {
      await notifyAvailableSlots(execution.district_id, dateformat(new Date(), 'dd-mm-yyyy'));
    }
  } catch (err) {
    console.log('No data available\nError: ', err);
  }
};

schedule.scheduleJob('40 * * * * *', () => {
  fetchResponse();
  console.log(`${count++} call`);
});
schedule.scheduleJob('0 * * * * *', async () => {
  executionDistrict = await notificationList.getDistrictList();
});
