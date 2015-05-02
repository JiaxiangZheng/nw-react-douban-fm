包含两个版本（Node客户端和node-webkit桌面应用程序）的豆瓣电台。其中Node版主要提供了一系列的豆瓣电台API、而node-webkit则实现了一个完整的电台。

截图：

![界面截图](./shortcut.png)

### 如何运行

`node-webkit`版本直接调用`nw .`，注意，默认情况下`node-webkit`不支持mp3格式的音频，参考[相关链接](https://github.com/nwjs/nw.js/wiki/Using-MP3-&-MP4-(H.264)-using-the--video--&--audio--tags.)。

********************

使用node-webkit和React实现的豆瓣电台播放器，以下为相关的一些**TODOs**：

* 支持自动播放下一曲（监听audio事件，完成后进入下一曲）
* React 模块分离
* 界面优化
* 支持用户信息
* 支持选择频道

BUGs:

* 加心后选下一曲，下一曲的心显示成红色

