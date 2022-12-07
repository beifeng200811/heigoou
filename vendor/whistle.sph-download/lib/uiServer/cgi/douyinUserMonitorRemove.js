const { remove: remove, findById: findById,insert:insert } = require('./../../db/dyUserMonitor');
const {cookies:cookies} = require('./../../db/dyCookie');
const { isDownLoding: isDownLoding } = require('./../../ffmpegUtil');
const { paserSecUid: paserSecUid, liveWatch: liveWatch } = require('./../../douyinHttpUtil');
module.exports = async (ctx) => {
    const { id, type } = ctx.request.body;
    if (type == 'remove') {
        await remove(id);
        ctx.body = { id: id };
    } else if (type == 'reload') {
        const user = await findById(id);
        console.log('remove',user)
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
        userInfo._id=userInfo.uid;
        userInfo.id=userInfo.uid;
        insert(userInfo);
        if (isDownLoding(userInfo.roomId)) {
            userInfo.liveDownRun = 1;
        } else {
            userInfo.liveDownRun = 0;
        }
        ctx.body = userInfo;
    }


}
