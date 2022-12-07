const {findAll:findAll, } = require('./../../db/dyUserMonitor');
const { isDownLoding: isDownLoding } = require('./../../ffmpegUtil');
module.exports = async (ctx) => {
    let result = {};

    const mUsers = await findAll();
    let cData = [];
    for(var i = 0; i < mUsers.length; i++) {
        let userInfo = mUsers[i];
        if( isDownLoding(userInfo.roomId)){
            userInfo.liveDownRun =1;
        }else{
            userInfo.liveDownRun =0;
        }

        cData.push(userInfo);
    }
    console.log('================================================================')
    result.total = mUsers.length;
    result.data = cData;
    ctx.body = result;
    
}
