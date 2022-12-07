; (function () {
    $('#dy_down_jiexi_single').click(function () {
        var urls = $('#tq_url_text').val().trim();
        if (urls) {
            grid.load({ urls: urls });
        } else {
            spop({
                template: '请输入要解析的地址',// string required. Without it nothing happens!
                style: 'warning',// success, warning or error
                autoclose: 2000,// miliseconds
                group: 'one-pop',
                position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
        }

    });
    $('#tq_url_text').on('change', function () {
        $('#dy_down_jiexi_user').attr('max_cursor', '0');
        $('#dy_down_jiexi_user').attr('has_more', 'true');
    });
    $('#dy_down_down_flush').click(function () {
        grid.setData([]);
        $('#load_data_result').html('');
        $('#dy_down_jiexi_user').attr('max_cursor', '0');
        $('#dy_down_jiexi_user').attr('has_more', 'true');
    });
    $('#dy_down_jiexi_user').click(function () {
        var urls = $('#tq_url_text').val().trim();
        var maxCursor = $(this).attr('max_cursor');
        var hasMore = eval($(this).attr('has_more'));
        // grid.load({ urls: urls });
        // return;
        if (!hasMore) {
            spop({
                template: '已加载全部数据',// string required. Without it nothing happens!
                style: 'success',// success, warning or error
                autoclose: 2000,// miliseconds
                group: 'one-pop',
                position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
            return;
        }
        if (urls) {
            grid.loading();
            $.post({
                url: '/cgi-bin/dy/user',
                dataType: 'json',
                // contentType:'application/json', 
                data: {
                    urls: urls,
                    maxCursor: maxCursor || 0
                },
                success: function (data) {
                    grid.unmask();
                    grid.addRows(data.data);
                    if (data.data && data.data[0]) {
                        var id = data.data[0].id;
                        var s = grid.findRow(function (row) {
                            if (row.id == id) return true;
                        });
                        scrollIntoViewItem(s);
                    }
                    var totalCount = grid.getData().length;
                    $('#dy_down_jiexi_user').attr('max_cursor', data.max_cursor);
                    $('#dy_down_jiexi_user').attr('has_more', data.hasMore);
                    $('#load_data_result').html('已加载：' + totalCount + '条');
                    spop({
                        template: '已加载 ' + totalCount + ' 条，未加载完成...可以继续提取',// string required. Without it nothing happens!
                        style: 'success',// success, warning or error
                        autoclose: 2000,// miliseconds
                        group: 'one-pop',
                        position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
                        icon: true// or false
                    });
                },
                error: function () {
                    spop({
                        template: '查询出错请稍后重试！',
                        position: 'top-center',
                        autoclose: 5000,
                        group: 'alterInfo',
                        style: 'error'// 'error'//info  or success
                    });
                }
            });
        } else {
            spop({
                template: '请输入要解析的地址',// string required. Without it nothing happens!
                style: 'warning',// success, warning or error
                autoclose: 2000,// miliseconds
                group: 'one-pop',
                position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
        }
    });
    $('#dy_down_user_monitor').click(function () {
        var urls = $('#tq_url_text').val().trim();
        if (!urls) {
            spop({
                template: '请输入作者主页地址',// string required. Without it nothing happens!
                style: 'warning',// success, warning or error
                autoclose: 2000,// miliseconds
                group: 'one-pop',
                position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
                icon: true// or false
            });
            return;
        }
        $.post({
            url: '/cgi-bin/dy/m/user',
            dataType: 'json',
            data: {
                urls: urls
            },
            success: function (data) {
                var s = grid.findRow(function (row) {
                    if (row.id == data.id) return true;
                });
                if (s) {
                    scrollIntoViewItem(s);
                    spop({
                        template: data.nickname + ' 已在监控列表',// string required. Without it nothing happens!
                        style: 'warning',// success, warning or error
                        autoclose: 2000,// miliseconds
                        group: 'one-pop',
                        position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
                        icon: true// or false
                    });
                } else {
                    grid.addRow(data, 0);
                }
            },
            error: function () {
                spop({
                    template: '查询出错请稍后重试！',
                    position: 'top-center',
                    autoclose: 5000,
                    group: 'alterInfo',
                    style: 'error'// 'error'//info  or success
                });
            }
        });
    });

    $('#dy_down_jiexi_flush').click(function () {
        $('#tq_url_text').val('');
    });
    $('#dy_down_down_selected').click(function () {
        downloadSelectedVideo();
    });
    $('#dy_down_down_all').click(function () {
        downloadAllVideo();
    });
    $('#dy_monitor_state').click(function () {
        var selectedVal = $('#schedule_pin_lv').val();
        var autoDownLive = $('#auto_down_load_live').prop('checked');
        $.post({
            url: '/cgi-bin/dy/m/schedule',
            dataType: 'json',
            data: {
                minutes: selectedVal,
                type: 1,
                autoDownLive: autoDownLive
            },
            success: function (data) {
                jobStatus();
                spop({
                    template: '监控任务已启动，任务后台运行，可关闭此页面',
                    position: 'top-center',
                    autoclose: 5000,
                    group: 'alterInfo',
                    style: 'success'// 'error'//info  or success
                });
            },
            error: function () {
                spop({
                    template: '设置失败，请重启或者稍后再试',
                    position: 'top-center',
                    autoclose: 5000,
                    group: 'alterInfo',
                    style: 'error'// 'error'//info  or success
                });
            }
        });
    });
    $('#dy_monitor_state_end').click(function () {
        $.post({
            url: '/cgi-bin/dy/m/schedule',
            dataType: 'json',
            data: {
                minutes: 0,
                type: 0
            },
            success: function (data) {
                jobStatus();
            },
            error: function () {
                spop({
                    template: '设置失败，请重启或者稍后再试',
                    position: 'top-center',
                    autoclose: 5000,
                    group: 'alterInfo',
                    style: 'error'// 'error'//info  or success
                });
            }
        });
    });
    $('#dy_monitor_message_qywx').click(function () {
        var urls = $('#qywx_monitor_webhook').val().trim();
        if (urls.length > 0) {
            $.post({
                url: '/cgi-bin/dy/m/qwmessage',
                dataType: 'json',
                data: {
                    urls: urls
                },
                success: function (data) {
                    spop({
                        template: '设置成功，我们发送了一条测试信息，如果没收到请检查地址是否正确',
                        position: 'top-center',
                        autoclose: 5000,
                        group: 'alterInfo',
                        style: 'success'// 'error'//info  or success
                    });
                },
                error: function () {
                    spop({
                        template: '设置失败，请重启或者稍后再试',
                        position: 'top-center',
                        autoclose: 5000,
                        group: 'alterInfo',
                        style: 'error'// 'error'//info  or success
                    });
                }
            });
        } else {
            spop({
                template: '请输入正确的webhook地址',
                position: 'top-center',
                autoclose: 5000,
                group: 'alterInfo',
                style: 'error'// 'error'//info  or success
            });
        }

    });
})();

mini.parse();
var grid = mini.get("datagrid1");
function onDescRender(e) {
    var shareUrl = '';
    if (e.row.item_list[0].share_url) {
        shareUrl = e.row.item_list[0].share_url;
    } else {
        shareUrl = 'https://www.douyin.com/video/' + e.row.item_list[0].aweme_id;
    }
    var text = '<a href="' + shareUrl + '" target="_blank">' + e.value + '</a>';
    return text;
}


function onCoverRender(e) {
    console.log(e.value)
    var text = '<img width="80px;" height="80px;" src="' + e.value[0] + '">';
    return text;
}

function operationRender(e) {
    var text = '<a href="javascript:copyToClipboard(\'' + e.value + '\',\'复制成功\')"><i class="fa fa-files-o" aria-hidden="true"></i>复制视频标题</a>';
    text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '<a href="javascript:downloadOne(\'' + e.row.id + '\')"><i class="fa fa-download" aria-hidden="true"></i>下载</a>';
    text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '<a href="javascript:removeVideo(\'' + e.row.id + '\')"><i class="fa fa-window-close" aria-hidden="true"></i>删除</a>';

    return text;
}

function operationSearchRender(e) {
    var text = '<a href="javascript:copyToClipboard(\'' + e.value + '\',\'复制成功\')"><i class="fa fa-files-o" aria-hidden="true"></i>复制标题</a>';
    text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '<a href="javascript:copyToClipboard(\'' + e.row.labels + '\',\'复制成功\')"><i class="fa fa-files-o" aria-hidden="true"></i>复制标签</a>';
    text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '<a href="javascript:downloadOne(\'' + e.row.vid + '\')"><i class="fa fa-download" aria-hidden="true"></i>下载</a>';
    text += '<div id="' + e.row.id + '"></div>';
    return text;
}
function onClickCopy(e) {
    var text = '<a href="javascript:copyToClipboard(\'' + e.value + '\',\'复制成功\')"><i class="fa fa-files-o" aria-hidden="true"></i>' + e.value + '</a>';
    return text;
}
function onDarenOperationRender(e) {
    var text = '';
    if (e.row.monitored) {
        text += '<a href="javascript:addToMonitor(\'' + e.row.id + '\',\'remove\')"><i class="fa fa-thermometer-full" aria-hidden="true"></i>移除监控</a>';
    } else {
        text += '<a href="javascript:addToMonitor(\'' + e.row.id + '\',\'add\')"><i class="fa fa-thermometer-full" aria-hidden="true"></i>加入监控列表</a>';
    }
    text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '<a href="javascript:removeDaren(\'' + e.row.id + '\',\'remove\')"><i class="fa fa-trash" aria-hidden="true"></i>删除达人</a>';

    if (e.row.roomId) {
        text += '&nbsp;&nbsp;&nbsp;&nbsp;';
        if (e.row.liveDownRun) {
            text += '<a href="javascript:liveRecord(\'' + e.row.id + '\',\'end\')"><i class="fa fa-refresh" aria-hidden="true"></i>结束录制</a>';
        } else {
            text += '<a href="javascript:liveRecord(\'' + e.row.id + '\',\'start\')"><i class="fa fa-refresh" aria-hidden="true"></i>录制直播</a>';

        }
    }

    text += '&nbsp;&nbsp;&nbsp;&nbsp;';
    text += '<a href="javascript:removeDaren(\'' + e.row.id + '\',\'reload\')"><i class="fa fa-refresh" aria-hidden="true"></i>更新信息</a>';

    return text;
}

function downLoadVideo(rows) {
    if (rows.length == 0) {
        spop({
            template: '请选择要下载的视频',// string required. Without it nothing happens!
            style: 'warning',// success, warning or error
            autoclose: 2000,// miliseconds
            group: 'one-pop',
            position: 'top-center',// top-left top-center bottom-left bottom-center bottom-right
            icon: true// or false
        });
        return;
    }
    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var realData;
        if (item.item_list) {
            realData = item.item_list[0];
        } else {
            realData = rows[i];
        }

        data.push({
            id: item.id,
            url: realData.video.play_addr.url_list[0],
            text: realData.desc,
            nickname: realData.author.nickname
        })
    }
    sendToHeiGouBackDown(data);
}
function downloadSelectedVideo() {
    var selected = grid.getSelecteds();
    downLoadVideo(selected);
}
function downloadAllVideo() {
    var data = grid.getData();
    downLoadVideo(data);
}
function downloadOne(id) {
    var row = grid.findRows(function (row) {
        if (row.id == id) return true;
    });
    downLoadVideo(row);
}
function onProgressRenderer(e) {
    //
    var text = '<div id="' + e.value + '"></div>';
    return text;
}

function removeVideo(id) {
    var s = grid.findRow(function (row) {
        if (row.id == id) return true;
    });
    grid.removeRow(s, false);
}
function scrollIntoViewItem(row) {
    grid.scrollIntoView(row);
}

function addToMonitor(id, type) {
    // 
    $.post({
        url: '/cgi-bin/dy/m/monitor',
        dataType: 'json',
        data: {
            id: id,
            type: type
        },
        success: function (data) {
            grid.reload();
        },
        error: function () {
            spop({
                template: '加入监控出错请稍后重试！',
                position: 'top-center',
                autoclose: 5000,
                group: 'alterInfo',
                style: 'error'// 'error'//info  or success
            });
        }
    });
}

function liveRecord(id, type) {
    $.post({
        url: '/cgi-bin/dy/m/live/record',
        dataType: 'json',
        data: {
            id: id,
            type: type
        },
        success: function (data) {
            // var s = grid.findRow(function (row) {
            //     if (row.id == id) return true;
            // });
            // grid.removeRow(s, false);
            grid.reload();
            spop({
                template: data.message,
                position: 'top-center',
                autoclose: 5000,
                group: 'alterInfo',
                style: 'success'// 'error'//info  or success
            });
        },
        error: function () {
            spop({
                template: '加入监控出错请稍后重试！',
                position: 'top-center',
                autoclose: 5000,
                group: 'alterInfo',
                style: 'error'// 'error'//info  or success
            });
        }
    });
}

function removeDaren(id, type) {
    $.post({
        url: '/cgi-bin/dy/m/remove',
        dataType: 'json',
        data: {
            id: id,
            type: type
        },
        success: function (data) {
            // var s = grid.findRow(function (row) {
            //     if (row.id == id) return true;
            // });
            // grid.removeRow(s, false);
            grid.reload();
        },
        error: function () {
            spop({
                template: '加入监控出错请稍后重试！',
                position: 'top-center',
                autoclose: 5000,
                group: 'alterInfo',
                style: 'error'// 'error'//info  or success
            });
        }
    });
}
function jobStatus() {
    // 
    $.post({
        url: '/cgi-bin/dy/m/schedule/state',
        dataType: 'json',
        data: {},
        success: function (data) {
            var text = '监控已停止';
            var className = 'badge badge-secondary';
            if (data.total) {
                text = '监控运行中...';
                className = 'badge badge-success';
            }
            $('#monitor_run_state').html(text);
            $('#monitor_run_state').attr('class', className);
            if (data.messages.length > 0) {
                var mRe = '';
                for (var i = 0; i < data.messages.length; i++) {
                    mRe += data.messages[i] + '\n';
                }
                $('#qywx_monitor_webhook').val(mRe);
            }
        },
        error: function () {

        }
    });
}