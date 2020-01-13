// pages/vehicle/code/code.js
var decode = require('../../../utils/decode.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputCode: "",
    activeCodes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.activeCode()
    //this.getActiveCode()
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
  handleActive: function (e) {
    if(this.data.inputCode == ''){
      wx.showToast({
        title: '激活码不能为空，请输入激活码',
        icon:'none'
      })
    }else{
      this.activeCode()
    }
 
  },
  activeCode: function (e) {
    var thisCtx = this
    var userInfo = wx.getStorageSync('userInfo')
    const rusultCode = decode.base64_decode(thisCtx.data.inputCode).split("/")
    wx.setStorageSync('userName', rusultCode[0])
    wx.setStorageSync('userPwd', rusultCode[1])
    console.log(wx.getStorageSync('userName')),
    console.log(wx.getStorageSync('userPwd'))
    const wxId = userInfo.unionId
    const scId = rusultCode[0]
    
    wx.request({
      url: 'https://wit.weichai.com/user/associateWithSc/' + wxId + "/" + scId,
      success: function (e) {
        switch (e.data.code) {
          case 1:
            console.log(e.msg)
            wx.showToast({
              title: '激活成功',
              icon: 'success'
            })
          wx.switchTab({
            url: '/pages/home/home',
          })
            break
          case 2:
            wx.showToast({
              title: '无此人',
              icon: 'none'
            })
            break
          case 3:
            wx.showToast({
              title: '此码已被激活',
              icon: 'none'
            })
            // wx.switchTab({
            //   url: '/pages/home/home',
            // })
            break
          default:
            wx.showToast({
              title: e.data.msg,
              icon: 'none'
            })
            break
        }
      }
    })
  },
  // getActiveCode: function (e) {
  //   var thisCtx = this
  //   var userInfo = wx.getStorageSync('userInfo')
  //   wx.request({
  //     url: 'http://localhost:8080/code/my/' + userInfo.id,
  //     success: function (e) {
  //       console.log(e)
  //       if (e.data.code == 1) {
  //         thisCtx.setData({
  //           activeCodes: e.data.msg
  //         })
  //       }
  //     }
  //   })
  // },
  codeInputChange(e) {
    this.setData({
      inputCode: e.detail.detail.value
    })
  }
})