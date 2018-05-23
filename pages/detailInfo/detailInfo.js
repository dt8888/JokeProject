var util = require('../../utils/config.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this;
    var infoId = options.infoId;
    util.getDetailInformation(infoId, function (data) {

      console.log(data.content)
      that.setData({
        content: data.content
      })
    })
  },
  
  //上拉
  onReachBottom: function () {

   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})