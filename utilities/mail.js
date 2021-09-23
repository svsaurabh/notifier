const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const sendMail = async (data) => {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
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
      to: ['svsaurabh@outlook.com'],
      subject: `${data[0].district_name} ${data[0].state_name} Available Slots ${data[0].min_age_limit}+`,
      text: generatetext(),
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendMail };
