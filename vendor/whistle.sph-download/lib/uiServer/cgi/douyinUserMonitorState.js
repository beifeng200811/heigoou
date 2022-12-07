const { update: update } = require('./../../db/dyUserMonitor');
const { set: set, get: get } = require('./../../appContext');
const { startScheduleJob: startScheduleJob, stopScheduleJob: stopScheduleJob, getRunningScheduleJob: getRunningScheduleJob } = require('./../../scheduleUtils')
module.exports = async (ctx) => {
    const jobs = getRunningScheduleJob();
    const { localStorage } = ctx.req;


    let result = {};
    let data = [];
    for (let i in jobs) {
        // console.error("正确开启的定时任务名称："+i);
        data.push(''+i);
    }
    result.total = data.length;
    result.jobs = data;
    let messages = [];
    const qwSendUrl = localStorage.getProperty('message_qywx');
    if(qwSendUrl){
        set('message_qywx',qwSendUrl);
        messages.push(qwSendUrl);
    }
    
    const fsSendUrl = localStorage.getProperty('message_feishu');
    if(fsSendUrl){
        set('message_feishu',fsSendUrl);
        messages.push(fsSendUrl);
    }

    const ddSendUrl = localStorage.getProperty('message_dingding');
    if(ddSendUrl){
        set('message_dingding',ddSendUrl);
        messages.push(ddSendUrl);
    }

    result.messages=messages;
    ctx.body = result;
}
