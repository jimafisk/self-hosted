const mongoose = require('mongoose');

const Database = {
  'site': mongoose.model('Site', { data: String }),
  'users': mongoose.model('Users', { email: String, hash: String }),
}

async function connectDatabase(uri) {
  console.log('uri', uri)
  const db = uri + '/primo?retryWrites=true&w=majority'
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    return true
  } catch(e) {
    return false
  }
}

async function saveData(collection, data) {
  const DataModel = Database[collection]
  const doc = new DataModel(data);
  await doc.save()
}

async function getData(collection) {
  const DataModel = Database[collection]
  const res = await DataModel.findOne({}, {}, { sort: { 'created_at' : -1 } }); // get newest document
  return res ? res.data : null
}

module.exports = {
  connectDatabase,
  saveData,
  getData
}