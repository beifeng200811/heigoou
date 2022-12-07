const { spawn } = require('child_process');

function downloadStreamingMedia(url, onError, onSuccess, onExit, onProgress) {
  // 定义一个变量来保存子进程的实例
  let ffmpeg;

  try {
    // 使用spawn方法调用子进程，并使用流媒体下载工具（例如FFmpeg）下载流媒体文件
    ffmpeg = spawn('ffmpeg', ['-i', url, 'output.mp4']);

    // 监听子进程的错误事件
    ffmpeg.on('error', (error) => {
      onError(error);
    });

    // 监听子进程的退出事件
    ffmpeg.on('exit', (code, signal) => {
      if (code === 0) {
        // 如果退出码为0，则下载成功
        onSuccess();
      } else {
        // 否则，下载失败
        onExit(code, signal);
      }
    });

    // 监听子进程的输出事件
    ffmpeg.stdout.on('data', (data) => {
      // 正则表达式用于从FFmpeg的输出中提取下载进度
      const regex = /time=(\d+:\d+:\d+.\d+)/g;
      const match = regex.exec(data.toString());
      if (match) {
        onProgress(match[1]);
      }
    });
  } catch (error) {
    onError(error);
  }

  // 返回一个函数，用于停止正在下载的进程
  return () => {
    if (ffmpeg) {
      ffmpeg.kill();
    }
  }
}

// 使用示例
const stop = downloadStreamingMedia(
  'https://example.com/stream.mp4',
  (error) => {
    console.log('Error:', error);
  },
  () => {
    console.log('Download completed!');
  },
  (code, signal) => {
    console.log(`ffmpeg exited with code ${code} and signal ${}`)})



    const { spawn } = require('child_process');

function downloadStreamingMedia(url) {
  // 定义一个变量来保存子进程的实例
  let ffmpeg;

  try {
    // 使用spawn方法调用子进程，并使用流媒体下载工具（例如FFmpeg）下载流媒体文件
    ffmpeg = spawn('ffmpeg', ['-i', url, 'output.mp4']);

    // 监听子进程的错误事件
    ffmpeg.on('error', (error) => {
      console.log('Error:', error);
    });

    // 监听子进程的退出事件
    ffmpeg.on('exit', (code, signal) => {
      if (code === 0) {
        // 如果退出码为0，则下载成功
        console.log('Download completed!');
      } else {
        // 否则，下载失败
        console.log(`ffmpeg exited with code ${code} and signal ${signal}`);
      }
    });

    // 监听子进程的输出事件
    ffmpeg.stdout.on('data', (data) => {
      // 正则表达式用于从FFmpeg的输出中提取下载进度
      const regex = /time=(\d+:\d+:\d+.\d+)/g;
      const match = regex.exec(data.toString());
      if (match) {
        console.log(`Download progress: ${match[1]}`);
      }
    });
  } catch (error) {
    console.log('Error:', error);
  }

  // 返回一个函数，用于停止正在下载的进程
  return () => {
    if (ffmpeg) {
      ffmpeg.kill();
    }
  }
}

// 使用示例
const stop = downloadStreamingMedia('https://example.com/stream.mp4');
// 停止正在下载的进程
stop();

