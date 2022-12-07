const { parseUrl: parseUrl, requestVideoDetails: requestVideoDetails } = require('./../../douyinHttpUtil');
const {generate:generate} = require('./../../utils');
module.exports = async (ctx) => {
    const { urls } = ctx.request.body;
    const { localStorage } = ctx.req;
    let openId = localStorage.getProperty('user_open_id');
    console.log(urls);
    // TODO  校验用户过期
    const body = parseUrl(openId, urls);
    console.log(body);
    const apiUrls = body.body.apiUrls;
    let result = {};
    let data = [];
    if (apiUrls && apiUrls.length > 0) {
        for (var i = 0; i < apiUrls.length; i++) {
            const url = apiUrls[i];
            try {
                
                let jsonDetail = requestVideoDetails(url);
                let item = jsonDetail.item_list[0];
                jsonDetail.id=item.aweme_id+'_'+generate(6);
                let playerUrl = item.video.play_addr.url_list[0].replace('playwm','play');
                item.video.play_addr.url_list[0]=playerUrl;
                item.video.play_addr.url_list[1]=playerUrl;
                item.video.play_addr.url_list[2]=playerUrl;
                data.push(jsonDetail);
            }catch (e) {
                console.log('error url '+url)
                console.log(e.message);
            }
            
        }
    }
    result.total = data.length;
    result.data = data;
    ctx.body = result;
}
