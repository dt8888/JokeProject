
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pictureStr:'',
    title:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var pictureUrl = JSON.parse(options.pictureUrl);
    var title = options.title
    this.setData({
      pictureStr: pictureUrl,
      title: title
    })

    wx.setNavigationBarTitle({
      title: that.data.title
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})