# 没有比这更简单的视频号视频下载工具了

## 背景

参加张哥组织的第四期视频号挑战，成绩平平，没脸跟大家说，但是在群里发现了一些小伙伴的痛点。

视频号怎么下载？微软文本转语音后怎么下载音频？等等

今天先给大家分享下视频号下载的工具。其他工具也会慢慢分享给大家。

## 实现原理

微信电脑端可以访问视频号对开发者来说是大大的福利，只要是通过`http协议`(说白了就是通过浏览器访问网页)访问的拦截就非常方便了。

通过**代理**的形式在数据包返回时做解析，匹配到视频号视频地址规则进行下载。

简单画个图示意下。

![image-20220516145543824](https://blog.javadev.top/pic-img/image-20220516145543824.png)

## 环境依赖

### Node 

下载的目的是安装代理插件，代理使用的是`whistle`这个开源工具

下载地址：http://nodejs.cn/download/	

![image-20220516145953796](https://blog.javadev.top/pic-img/image-20220516145953796.png)

选择自己操作系统对应的平台包下载即可，下载**长期支持**版本。

下载完成后，一路netx傻瓜式安装。

## lightproxy

`LightProxy` 是 `IFE` 团队开发的一款基于 `Electron` 和 `whistle` 的开源桌面代理软件。

windows下载地址：https://gw.alipayobjects.com/os/LightProxy/LightProxy-Setup.exe

Mac 下载地址：https://gw.alipayobjects.com/os/LightProxy/LightProxy.dmg

**下载完成后双击安装。**

## 环境配置

出现弹窗的**一律允许**，不用担心有病毒，程序员常用工具，没有问题的。

![image-20220516142509679](https://blog.javadev.top/pic-img/image-20220516142509679.png)

第一次启动 `Lightproxy` 会弹出以下提示，点击确定，mac 可能需要密码，windows是不用的。

![image-20220516142532395](https://blog.javadev.top/pic-img/image-20220516142532395.png)

![image-20220516142813145](https://blog.javadev.top/pic-img/image-20220516142813145.png)

## 插件安装

重头戏来了。

下载由本人开发的下载插件，下载地址：http://dl.javadev.top/whistle.sph-download.zip

### 插件安装

**推荐：**把下载的插件复制到`D`盘下某个目录，比如：`D:\视频号资源`，然后解压文件，一定要选择**解压到当前文件夹**。

![image-20220516151705408](https://blog.javadev.top/pic-img/image-20220516151705408.png)

解压完成以后进行安装。在资源管理器地址栏输入`cmd`然后回车。

![image-20220516152155002](https://blog.javadev.top/pic-img/image-20220516152155002.png)

会弹出来一个黑框框（命令行工具），在黑框框里输入下面内容，回车安装。

```shell
# 如果其他npm命令不存在，请先安装node 
# 注意最后面的 / 也要复制
npm install -g whistle.sph-download/
```

![image-20220516152424711](https://blog.javadev.top/pic-img/image-20220516152424711.png)

这里已经安装完成了，启动`lightproxy`

## 插件使用

插件的使用还是比较简单的，在浏览器输入`http://127.0.0.1:12888/plugin.sph-download/`访问插件配置界面

也可以通过lightproxy内置界面进行访问。

![image-20220516153903315](https://blog.javadev.top/pic-img/image-20220516153903315.png)

**主要包含两项配置**

- 视频下载地址，程序会生成默认地址，如果不是期望的地址，替换成自己的地址即可。
  - 推荐复制资源管理器地址栏的地址，避免出错
  - ![image-20220516153113558](https://blog.javadev.top/pic-img/image-20220516153113558.png)
- 是否自动下载视频。默认否

配置完成以后，点击右上角更新配置。

![image-20220516153205569](https://blog.javadev.top/pic-img/image-20220516153205569.png)

最后你就可以愉快的去刷视频号的内容了。不需要等带播放完成，程序识别到地址后会自动下载。



### 视频地址存储文件

默认会在你配置的文件夹下生成一个`urls.txt`文件，用于存储所有识别到的视频地址。



今天的分享就到这里了，希望各位视频号玩家都能大赚。

