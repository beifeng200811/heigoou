const path = require("path");
const persistentDBPath = path.join(__dirname, "./openlog.bfd");
const Datastore = require("nedb-promises");
const db = Datastore.create(persistentDBPath);
const child_process = require('child_process');
const process = require('process'); 

// 5 分钟压缩
db.persistence.setAutocompactionInterval(1000 * 60 * 5);

exports.insert = async function insert(data) {
  console.log('插入数据')
  console.log(data)
  if (!data) {
    return;
  }
  const finDoc = await db.findOne({ _id: data._id }).exec();
  if(finDoc) {
    return finDoc;
  }
  db.insert(data);
  // 主动访问一次才会进来~~~
  let cmd = 'start'; // 运行的指令
  if (process.platform == 'win32') {
    cmd = 'start';
  } else if (process.platform == 'linux') {
    cmd = 'xdg-open';
  } else if (process.platform == 'darwin') {
    cmd = 'open';
  }
  child_process.exec(`${cmd} http://127.0.0.1:` + data.port + '/plugin.sph-download/');


}



exports.findById = async function findById(id) {
  const finDoc = await db.findOne({ _id: id }).exec();
  return finDoc;
}
exports.findAll = async function findAll() {
  const docs = await db.find({}).sort({ time: 1 }).exec();
  return docs;
};

exports.count = async function count(id) {
  const finDoc = await db.count().exec();
  return finDoc;
}
exports.remove = function remove(id) {
  // db.remove({ _id: encfilekey }, {});
  db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
    console.log(numRemoved, ' 条数据已删除');
  });
};