const { paserSecUid: paserSecUid, liveWatch: liveWatch } = require('./../../douyinHttpUtil');
const {cookies:cookies} = require('./../../db/dyCookie');
const {insert:insert} = require('../../db/dyUserMonitor');
const { isDownLoding: isDownLoding } = require('./../../ffmpegUtil');
module.exports = async (ctx) => {
    const { urls } = ctx.request.body;
    const { localStorage } = ctx.req;
    let openId = localStorage.getProperty('user_open_id');
    console.log(urls)
    const secInfo = paserSecUid(urls,openId);

    console.log(secInfo)
    // TODO 校验用户过期
    const secUid = secInfo.body.secUid;
    const cookie = await cookies();
    const userInfo = liveWatch(secUid,cookie);
    userInfo.id=userInfo.uid;
    userInfo.monitored=0;
    const postData = userInfo.postData;
    let downHistory = {};
    for(var i = 0; i < postData.length; i++) {
        const item = postData[i];
        downHistory[item.awemeId] = { desc: item.desc, id: item.awemeId, fullPath: '初始化标记删除' };
    }
    userInfo.postData = undefined;
    userInfo.downHistory=downHistory;
    insert(userInfo);
    if( isDownLoding(userInfo.roomId)){
        userInfo.liveDownRun =1;
    }else{
        userInfo.liveDownRun =0;
    }
    ctx.body = userInfo;
}
