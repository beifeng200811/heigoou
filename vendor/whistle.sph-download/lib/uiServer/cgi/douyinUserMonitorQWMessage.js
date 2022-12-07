const { sendQYWXMessage: sendQYWXMessage, sendDDMessage: sendDDMessage, sendFSMessage: sendFSMessage } = require('./../../messages');
const { set: set } = require('./../../appContext');

module.exports = async (ctx) => {
    const { urls } = ctx.request.body;
    const { localStorage } = ctx.req;
    const sendUrls = urls.split('\n');
    let sendData = {
        sendUrl: '',
        vid:'7092722107993378079',
        img:'https://blog.javadev.top/hgdog.png',
        desc: '这是一条测试信息',
        url: 'https://www.douyin.com/user/MS4wLjABAAAAqRKBCoU2xnIHzPKzvr2WffvhmSfESL8mThlKgzoz65P-u7udz60gVSfhzyD8YPEt',
        path: localStorage.getProperty('videoDownLoadPath'),
        nickname: '黑狗小助手',
    }
    for (let i = 0; i < sendUrls.length; i++) {
        const url = sendUrls[i];
        console.log('推送for '+url)
        if (url.indexOf('qyapi.weixin.qq.com') > 0) {
            localStorage.setProperty('message_qywx', url);
            console.log('企业微信推送设置成功');
            set('message_qywx', url);
            sendData.sendUrlQW = url;
            sendQYWXMessage(sendData);
        } else if (url.indexOf('open.feishu.cn')>0) {
            localStorage.setProperty('message_feishu', url);
            console.log('飞书推送设置成功');
            set('message_feishu', url);
            sendData.sendUrlFS = url;
            sendFSMessage(sendData);
        } else if (url.indexOf('oapi.dingtalk.com')>0) {
            localStorage.setProperty('message_dingding', url);
            console.log('钉钉推送设置成功');
            set('message_dingding', url);
            sendData.sendUrlDD = url;
            sendDDMessage(sendData);
        }
    }
    ctx.body = { success: true };
}
