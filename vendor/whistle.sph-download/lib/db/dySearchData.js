const path = require("path");
const persistentDBPath = path.join(__dirname, "./dysearch.bfd");
const Datastore = require("nedb-promises");
const db = Datastore.create(persistentDBPath);

// 5 分钟压缩
db.persistence.setAutocompactionInterval(1000 * 60 * 5);

exports.insert = async function insert(data) {
  console.log('插入数据')
  console.log(data)
  if (!data) {
    return;
  }
  try {
    await db.remove({ _id: data.id });
    // finDoc.monitored = 1;
    data.time = new Date().getTime();
    await db.insert(data);
  } catch (e) { }
}

exports.update = async function update(data) {
  if (!data) {
    return;
  }

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
exports.page = async function page(num, size, sortField, sortOrder) {
  if (num < 1) {
    num = 1;
  }
  if(!sortField){
    sortField ='';
  }
  num = +num;
  size = +size;
  skip = (num - 1) * size;

  sort = { 'time': 1 };
  console.log('sortField: ' + sortField + ' sortOrder: ' + sortOrder)
  if (sortField.length>0) {
    order = 1;
    if (sortOrder == 'desc') {
      order = -1;
    }
    console.log('-----')
    console.log(typeof sortField)
    // sortField = 'time';
    // sortOrder = 1; // 升序
    // sortOrder = -1; // 降序
    if (sortField == 'create_time') {
      sort = { 'create_time': order };
    } else if (sortField == 'digg_count') {
      sort = { 'digg_count': order };
    } else if (sortField == 'collect_count') {
      sort = { 'collect_count': order };
    } else if (sortField == 'share_count') {
      sort = { 'share_count': order };
    } else if (sortField == 'comment_count') {
      sort = { 'comment_count': order };
    } else if (sortField == 'download_count') {
      sort = { 'download_count': order };
    }

  }
  console.log('pageNumber:' + num + ', size:' + size + ', sort:' + JSON.stringify(sort) + ', skip: ' + skip)
  const docs = await db.find({}).sort(sort).skip(skip).limit(size).exec();
  return docs;
};
exports.remove = function remove(id) {
  // db.remove({ _id: encfilekey }, {});
  db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
    console.log(numRemoved, ' 条数据已删除');
  });
};