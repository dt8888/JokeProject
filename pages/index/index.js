//index.js
var config = require('../../utils/config.js'); //导入配置文件
Page({
  data: {
    board: 'http://i.gtimg.cn/music/photo/mid_album_300/e/3/000kFqNl2ja3e3.jpg', //顶部图片
    songlist: [] //音乐列表
  },
  //页面加载事件
  onLoad: function (options) {
    this.setData({
      songlist: config.localData
    })
  }
})
