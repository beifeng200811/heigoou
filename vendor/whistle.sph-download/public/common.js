function formatDuring(mss) {
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((mss % (1000 * 60)) / 1000);
    var text = '';
    if (days) {
        text = days + '天';
    }
    if (hours) {
        text += hours + '时';
    }
    if (minutes) {
        text += minutes + '分';
    }
    if (seconds) {
        text += seconds + '秒';
    }
    return text;
}
function onDurationRenderer(e) {
    var duration = e.value;
    if(!duration){
        duration=e.row.item_list[0].video.duration;
    }
    if(duration){
        return formatDuring(duration);
    }else{
        return '--';
    }
    
}
function onSecondTimeRender(e) {
    if (e.value) {
        var d = new Date(e.value * 1000);
        return mini.formatDate(d, "yyyy-MM-dd HH:mm:ss");
    }else{
        return '--';
    }
}
function onAuthorRenderer(e){
    //nickname
    var text = '<img width="80px;" height="80px;" src="' + e.value.avatar_thumb.url_list[0] + '">'+e.value.nickname;
    return text;
}
function onLablesRenderer(e){
    var text = '';
    if(e.value.length >0){
        for(var i=0; i<e.value.length; i++){
            text += ' <a class="mini-button mini-button-success" >'+e.value[i]+'</a>';
        }
    }
    
    return text;
}
function onDarenMonitorRenderer(e){
    var text = '<img width="80px;" height="80px;" src="' + e.row.avatar300Url + '">';
    text = text +'<a target="_blank" href="https://www.douyin.com/user/'+e.row.secUid+'">'+e.value+'</a>';

    return text;
}
function onAuthorRenderer(e) {
    author = e.value;
    text = '<a target="_blank" href="https://www.douyin.com/user/'+author.sec_uid+'">'+author.nickname+'</a>';
    return text;
}
function onPlayerRenderer(e) {
    text = '<a target="_blank" href="https://www.douyin.com/video/'+e.row.vid+'">'+e.value+'</a>';
    return text;
}
function copyToClipboard(content, defaultToast,callback) {
    let $input = document.createElement('textarea')
    $input.style.opacity = '0';
    $input.value = content;
    document.body.appendChild($input);
    $input.select();
    document.execCommand('copy', true);
    document.body.removeChild($input);
    $input = null;
    if(defaultToast){
        spop({
            template: defaultToast ? defaultToast : '复制成功',// string required. Without it nothing happens!
            style: 'success',// success, warning or error
            autoclose: 2000,// miliseconds
            group: 'one-pop',
            position: 'top-right',// top-left top-center bottom-left bottom-center bottom-right
            icon: true// or false
        });
    }
    if (callback) {
        callback();
    }


}