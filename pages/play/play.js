
var app = getApp();
var util = require('../../utils/config.js');
var that;
var c = 0;
Page({
  data: {
    playsong: null,
    songTitle:'',
    songUrl: '',
    songImg: '',
    currentIndex: 0,
    songState: {
      progress: 0,
      currentPosition: '00:00',
      duration: '00:00'
    },
    dotsClass: ['on', ''],
    isPlaying: true,
    selectedIndex: 0,
    hasSonglists: true,
    lyricSwiperH: 400,
    marginTop:0,
    lyric: null,
    songFrom: 0,
    scrollTop: 0
  },
  onLoad: function (options) {
   that = this; 
   var index = options.songid;
   var hash = util.localData[index];
   var lyric = this.reconvert(hash.lyrics).slice(4);
   lyric = that.parseLyric(lyric);
   that.setData({
     songUrl: hash.play_url,
     songImg: hash.img,
     songTitle: hash.author_name,
     lyric: lyric
   });

    // 设置lyric-swiper的高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          lyricSwiperH: res.windowHeight - 180,
          event : res.windowHeight - 180
        });
      }
    });
    
  },
  onReady: function () {
    // 使用后台播放器播放音乐
    wx.playBackgroundAudio({ dataUrl: that.data.songUrl, title: that.data.songTitle, coverImgUrl: that.data.songImg });
    this.startPlay();
  },
  // 开始播放
  startPlay: function () {
    // 页面渲染完成
    that.songPlay();
    // 监听音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.songPlay();
    });
  },
  // 歌词滚动
  scrollHandle: function (event) {

  // setTimeout(function () {
  //     that.setData({
  //       scrollTop: (that.data.currentIndex - 5) * 24,
  //     });
  //   }, 1000);
   },
  // 解码>>中文
  reconvert: function (str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
      return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
  },
  // 解析歌词的方法
  parseLyric: function (lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for (var i = 0; i < lyrics.length; i++) {
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr)
        continue;
      var clause = lyric.replace(timeReg, '');
      if (clause.length > 0) {
        for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
          var t = timeRegExpArr[k];
          var min = Number(String(t.match(/\[\d*/i)).slice(1)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1));
          var time = min * 60 + sec;
          lrcObj[time] = clause;
        }
      }
    }
    return lrcObj;
  },
  // 转换时间格式
  timeToString: function (duration) {
    var str = '';
    var minute = parseInt(duration / 60) < 10
      ? ('0' + parseInt(duration / 60))
      : (parseInt(duration / 60));
    var second = duration % 60 < 10
      ? ('0' + duration % 60)
      : (duration % 60);
    str = minute + ':' + second;
    return str;
  },
  // 播放状态控制
  songPlay: function () {
    clearInterval(timer);
    var timer = setInterval(function () {
      // 获取后台音乐播放状态
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          // 播放状态 1表示播放中
          if (res.status == 1) {
            that.setData({
              isPlaying: true,
              songState: {
                progress: res.currentPosition / res.duration * 100,
                currentPosition: that.timeToString(res.currentPosition),
                duration: that.timeToString(res.duration)
              }
            });
            var i = that.data.currentIndex
            if (i < that.data.lyric.length) {
              if (res.currentPosition - 4 >= parseInt(that.data.lyric[i][0]))          {
                that.setData({
                  currentIndex: i + 1
                })
              }
            }
            if (that.data.currentIndex >= 5) {
              that.setData({
                scrollTop: (that.data.currentIndex - 5) * 20,
              })
            }
          } else {
            that.setData({ isPlaying: false });
            clearInterval(timer);
          }
        }
      });
    }, 1000);
  },
  // 切换播放状态按钮
  songToggle: function () {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status;
        // 播放中
        if (status == 1) {
          wx.pauseBackgroundAudio();
        } else if (status == 0) { // 暂停中
          wx.playBackgroundAudio({
            songTitle: that.datasongTitle,
            coverImgUrl: that.data.songImg,
            dataUrl: that.data.songUrl
          });
          that.songPlay();
        }
      }
    });
  },
  // 修改swiper 点样式
  swiperChange: function (ev) {
    var that = this;
    var dotsClass = ['', ''];
    dotsClass[ev.detail.current] = 'on';
    that.setData({ dotsClass: dotsClass });
  },
//})





// Page({

//   data: {

//     songUrl: '',
//     songImg: '',
//     isPlaying: true,

//     currentIndex: 0,

//     marginTop: 0,

//     lrcHeight:200,

//     songState: {

//       progress: 0,

//       currentPosition: '00:00',

//       duration: '00:00',

//       datalist: [],

//       lry: [],

//     }

//   },

//   onLoad: function (options) {
//     var that = this;
//     that.setData({

//       lry: that.sliceNull(that.parseLyric(util.localData[0].lyrics))

//     })

//     wx.playBackgroundAudio({

//       dataUrl: util.localData[0].play_url,

//       })

//     that.playSong()

//     // //自动播放下一首

//     // wx.onBackgroundAudioStop(function () {

//     //   that.next()

//     // })

//   },

  

  // requestDataSong: function (songId) {

  //   var that = this

  //   app.requestData('http://ting.baidu.com/data/music/links?songIds=' + songId, {}, (err, data) => {

  //     that.setData({

  //       pic: data.data.songList["0"].songPicRadio,

  //       bigData: data.data.songList["0"],

  //     })

  //     wx.playBackgroundAudio({

  //       dataUrl: data.data.songList["0"].songLink,

  //     })

  //   })

  //   that.playSong()

  // },

  // playSong: function () {

  //   var that = this

  //   let inv = setInterval(function () {

  //     wx.getBackgroundAudioPlayerState({

  //       success: function (res) {

  //         if (res.status == 1) {

  //           that.setData({

  //             isPlaying: true,

  //             songState: {

  //               progress: res.currentPosition / res.duration * 100,

  //               currentPosition: that.timeToString(res.currentPosition),

  //               duration: that.timeToString(res.duration),

  //             }

  //           })

  //           var i = that.data.currentIndex

  //           if (i < that.data.lry.length) {

  //             if (res.currentPosition - 4 >= parseInt(that.data.lry[i][0])) {

  //               that.setData({

  //                 currentIndex: i + 1

  //               })

  //             }

  //           }

  //           if (that.data.currentIndex >= 6) {

  //             that.setData({

  //               marginTop: -(that.data.currentIndex - 6) * 20,

  //               lrcHeight:200 + (that.data.currentIndex - 6) * 20

  //             })

  //           }

  //         } else {

  //           that.setData({

  //             isPlaying: false

  //           })

  //           clearInterval(inv)

  //         }

  //       }

  //     })

  //   }, 1000)

  // },

  // playAndPause: function () {

  //   var that = this

  //   if (that.data.isPlaying) {

  //     wx.pauseBackgroundAudio()

  //   } else {

  //     wx.playBackgroundAudio()

  //   }

  //   that.playSong()

  //   that.setData({

  //     isPlaying: !that.data.isPlaying

  //   })

  // },
//   //去除空白

  sliceNull: function (lrc) {

    var result = []

    for (var i = 0; i < lrc.length; i++) {

      if (lrc[i][1] == "") {

      } else {

        result.push(lrc[i]);

      }

    }

    return result

  },

  parseLyric: function (text) {

    //将文本分隔成一行一行，存入数组

    var lines = text.split('\n'),

      //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]

      pattern = /\[\d{2}:\d{2}.\d{2}\]/g,

      //保存最终结果的数组

      result = [];

    //去掉不含时间的行

    while (!pattern.test(lines[0])) {

      lines = lines.slice(1);

    };

    //上面用‘\n‘生成生成数组时，结果中最后一个为空元素，这里将去掉

    lines[lines.length - 1].length === 0 && lines.pop();

    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {

      //提取出时间[xx:xx.xx]

      var time = v.match(pattern),

        //提取歌词

        value = v.replace(pattern, '');

      //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔

      time.forEach(function (v1, i1, a1) {

        //去掉时间里的中括号得到xx:xx.xx

        var t = v1.slice(1, -1).split(':');

        //将结果压入最终数组

        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);

      });

    });

    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词

    result.sort(function (a, b) {

      return a[0] - b[0];

    });

    return result;

  },

  timeToString: function (duration) {

    let str = '';

    let minute = parseInt(duration / 60) < 10 ? ('0' + parseInt(duration / 60)) : (parseInt(duration / 60));

    let second = duration % 60 < 10 ? ('0' + duration % 60) : (duration % 60);

    str = minute + ':' + second;

    return str;

  },

})　