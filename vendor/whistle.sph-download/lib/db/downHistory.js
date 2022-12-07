const path = require("path");
const persistentDBPath = path.join(__dirname, "./dydownhis.bfd");
const Datastore = require("nedb-promises");
const db = Datastore.create(persistentDBPath);

// 5 分钟压缩
db.persistence.setAutocompactionInterval(1000 * 60 * 5);

exports.insert = async function insert(data) {
  if (!data) {
    return;
  }
  try {
    const finDoc = await db.findOne({ _id: data.id }).exec() || data;
    finDoc._id = data.id;
    await db.remove({ _id: data.id }, {}, function (err, numRemoved) {
    });
    // finDoc.monitored = 1;
    finDoc.time = new Date().getTime();
    await db.insert(finDoc, function (err, newDoc) {
    });
  } catch (e) { }
}

exports.update = async function update(data) {
  if (!data) {
    return;
  }
  if (!data.id) {
    return;
  }
  try {
    const finDoc = await db.findOne({ _id: data.id }).exec() || data;
    await db.remove({ _id: data.id }, {}, function (err, numRemoved) {
    });

    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      finDoc[key] = data[key];
    }
    await db.insert(finDoc, function (err, newDoc) {});
    return finDoc;
  } catch (e) { }
}

exports.findById = async function findById(id) {
  const finDoc = await db.findOne({ _id: id }).exec();
  return finDoc;
}
exports.findAll = async function findAll() {
  const docs = await db.find({}).sort({ time: 1 }).exec();
  return docs;
};

exports.remove = function remove(id) {
  // db.remove({ _id: encfilekey }, {});
  db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
    console.log(numRemoved, ' 条数据已删除');
  });
};