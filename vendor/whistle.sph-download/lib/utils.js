const fs = require("fs");
const path = require("path");
// exports.mkdirsSync = function mkdirsSync() {
exports.mkdirsSync = function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

exports.downCountKey = function downCountKey() {
    const today = new Date()

    const day = today.getUTCDate();
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    let todayName = '111down_' + year;
    if (month < 10) {
        todayName += '0' + month;
    } else {
        todayName += month;
    }
    if (day < 10) {
        todayName += '0' + day;
    } else {
        todayName += day;
    }

    return todayName;
};
exports.decodeUrl = function decodeUrl(params, type) {

    // 总结的规则：
    // m 有值 设置X-snsvideoflag=xV1  taskid=0
    // m 有值 并且 没有X-snsvideoflag 参数 直接取 就是清晰度比较高的
    // m 没值 删除X-snsvideoflag 设置taskid=0
    let downUrl = '';
    if (params['scene']) {
        // 这个规律没找到，原样输出了
        downUrl = docs[i].url;
    } else {
        // 拼接高清清版本地址
        downUrl = 'https://finder.video.qq.com/251/20302/stodownload?encfilekey=' + params['encfilekey'] + '&token=' + params['token'];
        downUrl += '&idx=' + params['idx'] + '&adaptivelytrans=' + params['adaptivelytrans'] + '&bizid=' + params['bizid'] + '&dotrans=' + params['dotrans'] + '&hy=' + params['hy'] + '';
        let m = params['m'];
        const taskid = params['taskid'];
        const snsvideoflag = params['X-snsvideoflag'];
        if (m) {
            // m有值
            if (!snsvideoflag) {
                // m 有值 并且 没有X-snsvideoflag 参数 直接取 就是清晰度比较高的
                downUrl = docs[0].url;
            } else {
                downUrl += '&m=' + m + '&X-snsvideoflag=xV1&taskid=0';
            }
        } else {
            //m 没值 删除X-snsvideoflag 设置taskid=0
            m = '';
            downUrl += '&m=' + m + '&taskid=0';
        }

    }
}

exports.generate = function generate(count) {
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890',
        str = '';
    for (var i = 0; i < count; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];

    }
    return str;
}

exports.GetFileName = function GetFileName(url) {
    var str = url.split("?");//url按？分开
    str = str[0].split("/");//按/分开
    str = str[str.length - 1].split("#");//按#分开
    return str[0].toLowerCase();//得到带后缀的名字
}
exports.GetExt = function GetExt(FileName) {
    var str = FileName.split(".");
    if (str.length == 1) {
        return null;
    }
    var ext = str[str.length - 1];
    ext = ext.match(/[0-9a-zA-Z]*/);
    return ext[0].toLowerCase();
}


exports.wildcard = function wildcard(pattern, word) {
    var result = "^";
    for (var i = 0; i < pattern.length; i++) {
        var ch = pattern.charAt(i);
        let isMatch = false;
        const META_CHARACTERS = ['$', '^', '[', ']', '(', ')', '{', '}', '|', '+', '.', '\\'];
        for (var metaCh in META_CHARACTERS) {
            if (ch == metaCh) {
                isMatch = true;
            }
        }
        if (isMatch) {
            result += "\\" + ch;
            continue;
        } else {
            switch (ch) {
                case '*':
                    result += ".*";
                    break;
                case '?':
                    result += ".{0,1}";
                    break;
                default:
                    result += ch;
            }
        }
    }
    result += "$";
    if (word.match(result) == null) {
        return false;
    }
    return true;
}
exports.metaSearch = function metaSearch(ch) {
    const META_CHARACTERS = ['$', '^', '[', ']', '(', ')', '{', '}', '|', '+', '.', '\\'];
    for (var metaCh in META_CHARACTERS) {
        if (ch == metaCh) {
            return true;
        }
    }
    return false;
}

exports.videoType = function videoType() {
    return new Array(
        { "Type": "video/*" },
        { "Type": "audio/*" }
    );
}

exports.videoExts = function videoExts() {
    return new Array(
        { "ext": "flv", "size": 0 },
        { "ext": "hlv", "size": 0 },
        { "ext": "f4v", "size": 0 },
        { "ext": "mp4", "size": 0 },
        { "ext": "mp3", "size": 0 },
        { "ext": "wma", "size": 0 },
        { "ext": "wav", "size": 0 },
        { "ext": "m4a", "size": 0 },
        { "ext": "letv", "size": 0 },
        // { "ext": "ts", "size": 0 },
        { "ext": "webm", "size": 0 },
        { "ext": "ogg", "size": 0 },
        { "ext": "ogv", "size": 0 },
        { "ext": "acc", "size": 0 },
        { "ext": "mov", "size": 0 },
        { "ext": "mkv", "size": 0 },
        { "ext": "m4s", "size": 0 },
        { "ext": "m3u8", "size": 0 }
    );
}


