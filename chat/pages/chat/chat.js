// pages/chat/chat.js
var MD5 = require('../../utils/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [{
      type: 1,
      msg: "可以随便问我问题哦!",
      key: (new Date()).valueOf
    }],
    userName: "",
    avatarUrl: "",
    scrolltop:'',
    searchinput:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取用户信息
   */
  getUser: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },
  /**
   * 判断发送信息是否为空
   */
  isEmpty: function (e) {
    if (e.length === 0) {
      return false
    } else {
      return true
    }
  },
  
  send: function (e) {
    var msg = e.detail.value.msg
    this.setData({
      searchinput: '',  
    })
    if (!this.isEmpty(msg)) {
      wx.showToast({
        title: '不能发送空信息',
        icon: 'none'
      })
      return
    }
    var msgList = this.data.msgList
    msgList.push({
      type: 0,
      msg: msg,
      key:(new Date()).valueOf
    })
    var charlenght = msgList.length;
    this.setData({
      msgList: msgList,
      scrolltop: "scroll" + charlenght,
    })
    this.getReply(msg)
  },
  editorMsg: function (data, msgList, charlenght){
      msgList.push({
      type: 1,
      msg: data.nli[0].desc_obj.result,
      key: (new Date()).valueOf
      })
      console.log(data)
      this.setData({
        msgList: msgList,
        scrolltop: "scroll" + msgList.length,
      })
      
      if (data.nli[0].type == "selection" || data.nli[0].type == "news" || data.nli[0].type == "joke" || data.nli[0].type == "baike"){
        if (data.nli[0].type === "baike"){
          (data.nli[0].data_obj).forEach((item) => {
            
            msgList.push({
              type: 1,
              msg: item.description,
              key: (new Date()).valueOf
            })
          })
          return 
        }else if(data.nli[0].type === "joke"){
          (data.nli[0].data_obj).forEach((item) => {
            msgList.push({
              type: 1,
              msg: item.content,
              key: (new Date()).valueOf
            })
          })
          return 
        }else{
          (data.nli[0].data_obj).forEach((item) => {
            msgList.push({
              type: 1,
              msg: item.title + item.detail,
              key: (new Date()).valueOf
            })
          })
        }
        
      }
  },
  getReply: function (sendMsg) {
    var that = this
    var rqJson = { "data": { "input_type": 1, "text": sendMsg }, "data_type":         "stt" };
    var rq = JSON.stringify(rqJson);
    var appkey = "262a7b2f36f64352b5005dc9e426997a"
    var api = "nli"
    //var timestamp = 1527923988000
    var timestamp = new Date().getTime()
    var appSecret = "ac9a36079487436db39d5585fc5f84f2"
    var sign = MD5.md5(appSecret + "api=" + api + "appkey=" + appkey + "timestamp=" + timestamp + appSecret);
    //var sign = "06edee7d4d9728ea7ee29ad91d7946a7"
    wx.request({
      url:'https://cn.olami.ai/cloudservice/api',
      method: "get",
      data: {
        appkey:appkey,
        api:api,
        timestamp: timestamp,
        sign: sign,
        cusid: "",
        rq: rq
      },
      header: {
        header: { 'content-type': 'application/x-www-form-urlencoded' },
      },
      success: function (res) {
       console.log(res)
       var msgList = that.data.msgList
       var charlenght = 0
       that.editorMsg(res.data.data, msgList, charlenght)
       that.setData({
         msgList: msgList,
       })
      },
      fail:function(res){
        var msgList = that.data.msgList
        msgList.push({
          type: 1,
          msg: "出错了!",
          key: (new Date()).valueOf
        })
        that.setData({

        })
      }
    })
  }
})