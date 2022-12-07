const path = require('path');
const { remove: remove, findById: findById, insert: insert } = require('./../../db/dyUserMonitor');
const { cookies: cookies } = require('./../../db/dyCookie');
const { get: getConfig } = require('./../../appContext');
const { isDownLoding: isDownLoding, killFFProcessById: killFFProcessById, ff_download: ff_download } = require('./../../ffmpegUtil');
const { paserSecUid: paserSecUid, liveWatch: liveWatch } = require('./../../douyinHttpUtil');
module.exports = async (ctx) => {
  const { id, type } = ctx.request.body;
  const downLoadPath = getConfig('downLoadPath');

  let result = {};
  if (type == 'start') {
    const user = await findById(id);
    console.log('remove', user)
    const secUid = user.secUid;
    const cookie = await cookies();
    console.log('remove  cookie ' + cookie);
    console.log('remove  secUid ' + secUid);
    const userInfo = liveWatch(secUid, cookie);
    const postData = userInfo.postData;

    let downHistory = {};
    for (var i = 0; i < postData.length; i++) {
      const item = postData[i];
      downHistory[item.awemeId] = { desc: item.desc, id: item.awemeId, fullPath: '初始化标记删除' };
    }
    userInfo.postData = undefined;
    userInfo.downHistory = downHistory;
    userInfo._id = userInfo.uid;
    userInfo.id = userInfo.uid;
    userInfo.liveDownRun = 1;
    insert(userInfo);
    if (isDownLoding(userInfo.roomId)) {
      result.message = '录制中...';
    } else {
      const roomData = userInfo.roomData;
      // "status": 2, 直播中
      const stream_url = roomData['stream_url'];
      const default_resolution = stream_url['default_resolution'];
      let play_pull_url = stream_url['flv_pull_url'][default_resolution];
      // FULL_HD1 原画
      // uhd  蓝光/原画
      // HD1 超清
      // SD1 
      // SD2 高清
      // LD 标清

      play_pull_url = play_pull_url.replace('http://', 'https://');
      const liveDownLoadFile = path.join(downLoadPath, userInfo.nickname + '-' + userInfo.roomId + '.mp4')

      ff_download({
        id: userInfo.roomId,
        filename: liveDownLoadFile,
        url: play_pull_url,
      }, function (data) {
        console.log(`${data}`)
        // result.process.kill('SIGKILL');
      }, function (code, id) {
        console.log('close ' + id)
      }, function (code, id) {
        console.log('error ' + id)
      }, function (code, id) {
        console.log('exit ' + id)
      });
      result.message = '录制中...';

    }
  } else if (type == 'end') {
    const user = await findById(id);

    result.message = '结束录制.';
    killFFProcessById(user.roomId)
  }
  ctx.body = result;


}
