const { paserSecUid: paserSecUid, paserVideos: paserVideos } = require('./../../douyinHttpUtil');
const {generate:generate} = require('./../../utils');
module.exports = async (ctx) => {
    const { urls,maxCursor } = ctx.request.body;
    const { localStorage } = ctx.req;
    let openId = localStorage.getProperty('user_open_id');
    const secInfo = paserSecUid(urls,openId);
    // TODO 校验用户过期
    // console.log(secInfo);
    const secUid = secInfo.body.secUid;
    const videos = paserVideos(secUid,maxCursor);
    // console.log(videos);
    let result = {};
    let data = [];
    const awemeList = videos.aweme_list;
    for(var i = 0; i < awemeList.length; i++) {
       const item= awemeList[i];
        data.push({
            item_list:[item],
            id:item.aweme_id+'_'+generate(6)
        });
    }
    result.total = data.length;
    result.data = data;
    result.hasMore = videos.has_more;
    result.max_cursor=videos.max_cursor;
    ctx.body = result;
}
