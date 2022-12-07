const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const serve = require('koa-static');
const path = require('path');
const router = require('koa-router')();
const setupRouter = require('./router');
const {keepLive:keepLive} = require('./../keeplive');
const WebSocket = require('ws');

const request = require('sync-request');
const { Server } = WebSocket;
const MAX_AGE = 1000 * 60 * 5;
const { get: getConfig } = require('./../appContext');
const { downloadFile: downloadFile } = require('./../downUtil');
const { backdomain: backdomain } = require('./../consta');
const { mkdirsSync: mkdirsSync } = require('./../utils');

const { insert: insert,findById:findById } = require('./../db/openlog');

module.exports = (server, options) => {
  const app = new Koa();
  app.proxy = true;
  app.silent = true;
  onerror(app);
  setupRouter(router);
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(serve(path.join(__dirname, '../../public'), { maxage: MAX_AGE }));
  server.on('request', app.callback());
  console.log('server start')
  // const wss = new Server({port: options.config.port+1});
  const wss = new Server({ server });
  wss.on('connection', (ws) => {
    // 接收客户端信息并把信息返回发送
    ws.on('message', (message) => {
      //  setConfig('user_open_id',openId);
      let openId = getConfig('user_open_id');
      let canDownload = false;
      if (openId) {
        const userBodyStr = request('GET', backdomain() + '/sph/hg/user/' + openId).getBody().toString();
        const userInfoJson = JSON.parse(userBodyStr);
        const userInfo = userInfoJson.body;
        if (!userInfo.expired) {
          canDownload = true;
        }
      }
      
      if (canDownload) {
        const downLoadPath = getConfig('downLoadPath');
        message = JSON.parse(decodeURIComponent(message.toString()));
        console.log(message);
        console.log('接收到要下载命令如上')
        if (message.command === 'down') {
          let messageResponse = {};
          messageResponse = { 'command': 'message', 'text': '开始下载' };
          ws.send(JSON.stringify(messageResponse), (err) => { // send 方法的第二个参数是一个错误回调函数
            if (err) {
              console.log(`[SERVER] error: ${err}`);
            }
          });
          const downData = message.data;
          console.log(downData.length)
          for (var i = 0; i < downData.length; i++) {
            messageResponse = {};
            const dData = downData[i];
            console.log(dData);
            console.log('下载单条数据');
            let downFilePathName = downLoadPath;
            // if(dData.nickname){
            //   downFilePathName = downFilePathName +'/' +dData.nickname;
            // }
            mkdirsSync(downFilePathName);
            
            downFilePathName = downFilePathName+'/' + dData.text.trim() + '.mp4';
            dData.filename=downFilePathName;
            downloadFile(dData, function (id,percentage) {
              percentage = percentage.toFixed(2);
              messageResponse.text = '' + percentage;
              messageResponse.command = 'percent';
              messageResponse.id=id;
              ws.send(JSON.stringify(messageResponse), (err) => { // send 方法的第二个参数是一个错误回调函数
                if (err) {
                  console.log(`[SERVER] error: ${err}`);
                }
              });
            }, function (id,text) {
              messageResponse.text = text + ' 下载完成';
              messageResponse.command = 'message';
              ws.send(JSON.stringify(messageResponse), (err) => { // send 方法的第二个参数是一个错误回调函数
                if (err) {
                  console.log(`[SERVER] error: ${err}`);
                }
              });
            });
          }
        } else if (message.command == 'dyDown') {

        }
      } else {
        let messageResponse = {};
        messageResponse.text = '验证码已过期，请续费使用，微信公众号回复7，获取付费信息' + '';
        messageResponse.command = 'alert';
        ws.send(JSON.stringify(messageResponse), (err) => { // send 方法的第二个参数是一个错误回调函数
          if (err) {
            console.log(`[SERVER] error: ${err}`);
          }
        });
      }





    });
  });
  const now = new Date();
  const year =now.getFullYear();
  const month = now.getMonth();
  const day = now.getUTCDate();
  const open_id=''+year+(month+1)+day
  console.log(open_id);
  insert({_id:open_id,port:options.config.port})
  setInterval(() =>keepLive(options.config.port), 1000*60)

};
