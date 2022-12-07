
module.exports = (server, options) => {
  server.on('request', (req, res) => {
    // do something
    
    const oReq = req.originalReq;
    
    // console.log(oReq)
    const oRes = req.originalRes;
    // console.log(oRes)
    // req.getSession((s) => {
    //   // 如果设置了 enable://hide 会获取到空数据
    //   if (!s) {
    //     return;
    //   }
    //   console.log(s)
    // });
  });
};
