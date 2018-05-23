var util = require('../../utils/config.js'); 
var that;
var allTextJokes;
var allPictureJokes;
var page;
Page({
  data: {
    navbar: [
      '文字', '图片'
    ],
    currentTab: 0, // 导航栏切换索引
    textJokes: [],
    pictureJokes: [],
    pageSize:20,
    imagewidth:400,
    scrollviewH: 0,
    scrollToView: 'scrollTop', // 返回顶部位置
    backToTop: false, // 返回顶部

  },
  onLoad: function (options) {
    that = this;
    page = 1;
   //计算图片的宽度
    this.setData({
      imagewidth: wx.getSystemInfoSync().windowWidth-20
    }) 
    wx.showLoading({ title: '数据加载中...', mask: true });
    //文本动画
    util.getTextJokes(that.data.page, that.data.pageSize,function (data) {
      wx.hideLoading();
      that.setData({textJokes: data.contentlist});
    });
    //图片动画
    util.getPictureJokes(that.data.page, that.data.pageSize,function (data) {
      that.setData({
        pictureJokes: data.contentlist
      });
    });
  },
  // 导航栏操作
  onNavbarTap: function (ev) {
    this.setData({ currentTab: ev.currentTarget.dataset.index });
  },

  //看大图
  onToplistTap:function(even){
    var index = even.currentTarget.dataset.index;
    var pictureUrl = JSON.stringify(that.data.pictureJokes[index].img);
    var title = that.data.pictureJokes[index].title;
    wx.navigateTo({
      url: '../lookBigPicture/lookBigPicture?pictureUrl=' + pictureUrl+"&title="+title,
    })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    if (that.data.currentTab==0){
      allTextJokes = that.data.textJokes;
      page = page + 1;
      util.getTextJokes(page, that.data.pageSize, function (data) {
        if (data.contentlist.length > 0) {
          for (var i = 0; i < data.contentlist.length; i++) {
            allTextJokes.push(data.contentlist[i])
          }
          that.setData({
            textJokes: allTextJokes
          })
        }
        // 隐藏加载框  
        wx.hideLoading();

      })
    }else
    {
      allPictureJokes = that.data.pictureJokes;
      page = page + 1;
      util.getPictureJokes(page, that.data.pageSize, function (data) {
        if (data.contentlist.length > 0) {
          for (var i = 0; i < data.contentlist.length; i++) {
            allPictureJokes.push(data.contentlist[i])
          }
          that.setData({
            pictureJokes: allPictureJokes
          })
        }
        // 隐藏加载框  
        wx.hideLoading();

      })
    }
    
  },

});