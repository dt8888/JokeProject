//logs.js
var util = require('../../utils/config.js');
var page;
var that;
var allDataList;
Page({
  data: {
    contentlist:[],
    picture:'http://img1.gtimg.com/health/pics/hv1/83/206/2262/147139163.jpg'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   that = this;
   page = 1;
   wx.showLoading({ title: '数据加载中...', mask: true });
   util.searchAllInformation('疾病',page, function(data){
     wx.hideLoading();
    that.setData({
      contentlist: data.contentlist
     })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    allDataList = [];
    util.searchAllInformation('疾病', page, function (data) {
      for (var i = 0; i < data.contentlist.length; i++) {
        allDataList.push(data.contentlist[i])
      }
      that.setData({
        contentlist: allDataList
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    allDataList = that.data.contentlist;
    page = page + 1; 
    util.searchAllInformation('疾病', page, function (data) {
      if (data.contentlist.length > 0) {
        for (var i = 0; i < data.contentlist.length; i++) {
          allDataList.push(data.contentlist[i])
        }
        that.setData({
          contentlist: allDataList
        })
      } 
      // 隐藏加载框  
      wx.hideLoading();
      
    })
  },
  /*
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})
