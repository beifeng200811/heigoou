
const path = require("path");
const persistentDBPath = path.join(__dirname, "./dy111earch.bfd");
const Datastore = require("nedb-promises");
const { defaultCookie: defaultCookie } = require('./../douyinHttpUtil');

const db = Datastore.create(persistentDBPath);
(async () => {
  id = 100;
  const finDoc = await db.findOne({ _id: id }).exec();
  const nowTime = new Date().getTime();

  if (finDoc) {
    const cacheTime = finDoc.time;
    if (nowTime - cacheTime < 24 * 60 * 60 * 1000) {
      // 一天内的cokie
      console.log('cache cookie '+finDoc.cookie)
      return finDoc.cookie;
    }
  }
  const cookies = await defaultCookie();
  data = {
    _id: id,
    time: nowTime,
    cookie: cookies
  }
  await db.remove({ _id: id });
  await db.insert(data);
  console.log('cookies new '+cookies)
  return cookies


})();
