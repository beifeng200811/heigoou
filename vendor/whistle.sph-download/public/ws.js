var hgWebSocket = null;
var lockReconnect = false;  //避免ws重复连接
var defaultWsPort = 12888;
var connectSocketSucceed = false;
var sendMessageInternal;
function connectSocket() {
    try {
        defaultWsPort = location.port;
        hgWebSocket = new WebSocket("ws://127.0.0.1:" + defaultWsPort + "/plugin.sph-download");
        initEvent();
    } catch (e) {
        reconnect();
        // console.log(e);
        // console.log('111111')
    }
}
function suggestPort() {
    if (defaultWsPort == 12888) {
        defaultWsPort = 8899;
    } else if (defaultWsPort == 8899) {
        defaultWsPort = 12888;
    }
    return defaultWsPort;
}
//重连
function reconnect() {

    if (lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        connectSocket();
        lockReconnect = false;
    }, 2000);
}
function closeConnectSocket() {
    hgWebSocket.close();
    connectSocketSucceed = false;
}
function initEvent() {
    //连接发生错误的回调方法
    hgWebSocket.onerror = function (e) {
        spop({
            template: '<a href="https://wcmyxpl8xu.feishu.cn/docx/doxcnUweuEbh4Vbo3h0xXgQWFCd" target="_blank" >未检测到黑狗客户端，请启动客户端</a>',// string required. Without it nothing happens!
            style: 'error',// success, warning or error
            autoclose: 150000,// miliseconds
            group: 'one-pop',
            position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
            icon: true// or false
        });
        suggestPort();
        reconnect();
        console.log("llws连接错误!");
    };

    //连接成功建立的回调方法
    hgWebSocket.onopen = function (event) {
        connectSocketSucceed = true;
        console.log("llws连接成功!" + new Date().toLocaleString());
    }

    //接收到消息的回调方法
    hgWebSocket.onmessage = function (event) {
        console.log("llws收到消息啦:" + event.data);
        connectSocketSucceed = true;
        var data = JSON.parse(event.data);
        if (data.command == 'message') {
            spop({
                template: data.text,// string required. Without it nothing happens!
                style: 'success',// success, warning or error
                autoclose: 5000,// miliseconds
                group: 'one-pop',
                position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
            $('#'+data.id).html('完成');
            setTimeout(function () {
                $('#'+data.id).html('');
            },1000)
        } else if (data.command == 'alert') {
            spop({
                template: data.text,// string required. Without it nothing happens!
                style: 'error',// success, warning or error
                autoclose: 15000,// miliseconds
                group: 'one-pop',
                position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
            

        } else if (data.command == 'percent'){
            // percent
            var show=+data.text;
            // if(show==100){
            //     show='<a javascript:void(0)>打开下载目录</a>';
            // }else{
            //     show += '%';
            // }
            $('#'+data.id).html(show);
        }
        // document.getElementById('down_a_back').innerHTML='喂狗粮（自动带标题下载）'+data.text;

    }

    //连接关闭的回调方法
    hgWebSocket.onclose = function (e) {
        console.log("llws连接关闭!" + new Date().toLocaleString());
        connectSocketSucceed = false;
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        hgWebSocket.close();
    }
}
function sendToHeiGouBackDown(downData) {
    // [{ 'url': dData.url, 'text': dData.text,id:dData.id }]
    if ('WebSocket' in window) {
        if (!connectSocketSucceed) {
            connectSocket();
        }
        sendMessageInternal = setInterval(function () {
            if (connectSocketSucceed) {
                clearInterval(sendMessageInternal);
                var sendMessage = {
                    'command': 'down',
                    'type': 'hg',
                    data: downData
                };
                sendMessage = encodeURIComponent(JSON.stringify(sendMessage));
                hgWebSocket.send(sendMessage);

            } else {
                console.log('等待黑狗张嘴~');
            }
        }, 500)
    } else {
        alert('Not support websocket');
        return;
    }

}