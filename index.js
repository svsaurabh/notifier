const axios = require('axios');
const dateformat = require('dateformat');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();
var count = 1;
let prevStateKanpur = [0, 0];
let prevStateMbd = [0, 0];
let prevStateAgra = [0, 0];

const getStates = async (district, currentDate, prevState) => {
  try {
    axios({
      method: 'get',
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${currentDate}`,
      headers: { accept: 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'},
    }).then((response) => {
      // console.log(JSON.stringify(response.data.sessions.length));

      let data = response.data.sessions;
      data = data.filter((center) => {
        return center.available_capacity > 0 ? true : false;
      });
      // console.log(data.length);
      let data18 = [];
      let data45 = [];
      data.map((center) => {
        center.min_age_limit === 45 ? data45.push(center) : data18.push(center);
      });
      data18.length > 0
        ? prevState[0] !== data18.length
          ? (prevState[0] = changeState(prevState[0], data18))
          : console.log('same data')
        : console.log('No 18+ record Found');
      data45.length > 0
        ? prevState[1] !== data45.length
          ? (prevState[1] = changeState(prevState[1], data45))
          : console.log('same data')
        : console.log('No 45+ record Found');
    });
  } catch (err) {
    console.log('Error :', err);
  }
  return prevState;
};

const changeState = (state, data) => {
  var val = state;
  console.log(
    'mailing to ' +
      data[0].district_name +
      data[0].min_age_limit +
      `changed from ${val} to ${data.length}`
  );
  val = data.length;
  mailing(data);
  return val;
};

async function mailing(data) {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })
  );
  const generatetext = () => {
    let count = 1;
    let text = '';
    data.map((center) => {
      text =
        text +
        count++ +
        ') ' +
        center.name +
        ' ' +
        center.district_name +
        '\nDate: ' +
        center.date +
        ' \n' +
        'Dose1 slots: ' +
        center.available_capacity_dose1 +
        ' , Dose2 slots: ' +
        center.available_capacity_dose2 +
        '\n' +
        'Vaccine name: ' +
        center.vaccine +
        ' Age: ' +
        center.min_age_limit +
        '+' +
        '\n\n';
    });
    return text;
  };
  try {
    let info = await transporter.sendMail({
      from: {
        name: 'Notifier',
        address: process.env.EMAIL,
      },
      to: ['svsaurabh97@gmail.com'],
      subject: `${data[0].district_name} ${data[0].state_name} Available Slots ${data[0].min_age_limit}+`,
      text: generatetext(),
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.log(err);
  }
}

const fetchResponse = async () => {
  prevStateKanpur = await getStates('664', dateformat(new Date(), 'dd-mm-yyyy'), prevStateKanpur);
  prevStateMbd = await getStates('678', dateformat(new Date(), 'dd-mm-yyyy'), prevStateMbd);
  prevStateAgra = await getStates('622', dateformat(new Date(), 'dd-mm-yyyy'), prevStateAgra);
};
// const job = schedule.scheduleJob('0 * * * * *', () => {
//   fetchResponse();
//   console.log(`${count++} call`)
// });

fetchResponse();
