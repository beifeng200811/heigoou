const WebSocket = require('ws');

const { Server } = WebSocket;



module.exports = (server, options) => {
  const wss = new Server({port: options.config.port+1});
  // wss.on('connection', handleConnect);
  wss.on('connection', (ws) => {
    // 接收客户端信息并把信息返回发送
   
    ws.on('message', (message) => {
      console.log(message.toString())
      ws.send(message.toString(), (err) => { // send 方法的第二个参数是一个错误回调函数
        if (err) {
          console.log(`[SERVER] error: ${err}`);
        }
    })
  })
})
};