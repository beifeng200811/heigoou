const { update: update } = require('./../../db/dyUserMonitor');
module.exports = async (ctx) => {
    const { id,type } = ctx.request.body;
    let result = {};
    let data = { id: id };
    if(type=='add'){
        data.monitored=1;
    }else{
        data.monitored=0;
    }
    
    const re = await update(data);
    ctx.body = re;
}
