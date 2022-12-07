
const request = require('sync-request');
const { insert: insert, page: pageData } = require('../../db/persistent');
const { generate: generate } = require('./../../utils');
const { backdomain: backdomain } = require('./../../consta');
module.exports = async (ctx) => {
    const { page, size } = ctx.request.query;
    const { localStorage } = ctx.req;

    const fullDownLoadCode = localStorage.getProperty('fullDownLoadCode');
    let data = [];
    data['data'] = [];
    let openId = localStorage.getProperty('user_open_id');
    if (openId) {
        const userBodyStr = request('GET', backdomain() + '/sph/hg/user/' + openId).getBody().toString();
        const userInfoJson = JSON.parse(userBodyStr);
        const userInfo = userInfoJson.body;
        if (!userInfo.expired) {
            data = await pageData(page, size, fullDownLoadCode);
        }
    }

    data['ads'] = [];
    if (data.data.length > 0) {
        try {
            const openId = localStorage.getProperty('user_open_id');
            const adBody = request('GET', backdomain() + '/sph/open/api/ad/list/' + openId).getBody().toString();
           console.log(adBody)
            const adResults = JSON.parse(adBody);
            if (adResults.success == 1) {
                const adList = adResults.body;
                if (adList.length > 0) {
                    for (var i = 0; i < adList.length; i++) {
                        var gen = generate(8);
                        adList[i]['uuid'] = gen;
                    }
                    var index = page % adList.length;
                    console.log('ad index '+index)
                    data.ads.push(adList[index]);
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
    ctx.body = {
        data: data
    };
}
