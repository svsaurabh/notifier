const State = require('../models/state');
const District = require('../models/district');
const mongo = require('../models/index');

const getDistrictList = async () => {
  await mongo.connectDB();
  const dbResult = await District.find({ is_active: true }).populate('state_id', ['state_name']);
  console.log(dbResult);
  mongo.disconnectDB();
  return dbResult;
};

module.exports = { getDistrictList };
