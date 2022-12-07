# 在找不到第二款更简单的视频号视频下载工具了

微信不甘落后于某音，一直在视频号持续发力，入住视频号的作者也越来越多。

看到一些喜欢的作品总是有种下载下来「研究」的冲动，但是每次抓包太浪费时间了，如果我看哪个就能给我下载哪个岂不美哉。

说干就干！

我一直喜欢用的代理工具是 `lightproxy`，支持自定义插件，刚好符合需求就用它了。

高级玩家直接划到下面的插件安装即可。

懒人专用下载地址：

链接: https://pan.baidu.com/s/1mBBO_kqDoARgsI-szofTmA?pwd=s12s 

提取码: s12s 

安装顺序：`node -> lightproxy -> 插件`

## 插件优势

- 你看什么就会下载什么
- 支持自定义配置是否下载视频
- 支持自定义下载路径
- 视频去除，不会重复下载

## 实现原理

微信电脑端可以访问视频号对开发者来说是大大的福利，只要是通过 `http协议`(说白了就是通过浏览器访问网页)访问的拦截就非常方便了。

通过**代理**的形式在数据包返回时做解析，匹配到视频号视频地址规则进行下载。

简单画个图示意下。

![image-20220516145543824](https://blog.javadev.top/pic-img/image-20220516145543824.png)

## 环境依赖

### Node 


下载地址：http://nodejs.cn/download/	

![image-20220516145953796](https://blog.javadev.top/pic-img/image-20220516145953796.png)

选择自己操作系统对应的平台包下载即可，下载**长期支持**版本。

下载完成后，一路 next 傻瓜式安装。

## lightproxy

`LightProxy` 是一款类似于 `charles` 和 `Fiddler` 的代理工具，更适合开发人员快速使用。

windows下载地址：https://gw.alipayobjects.com/os/LightProxy/LightProxy-Setup.exe

Mac 下载地址：https://gw.alipayobjects.com/os/LightProxy/LightProxy.dmg

**下载完成后双击安装。安装完成以后会自动启动，等它启动完成以后，关掉它。**

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

## Q&A

如果你的电脑不能安装 node 也可以忽略这一步。参照下面步骤配置。

在资源管理器输入 `%appdata%\LightProxy\files\node\node_modules` 把之前解压的插件复制到这个目录，然后重启 `LightProxy` 。



