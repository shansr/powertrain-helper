// pages/bind/bind.js

var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputName: '',
    inputPwd: '',
    isPassWord: true, // 切换密码显示隐藏
    pwd_val: '', // 密码值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // nameInputChange(e) {
  //   console.log(e)
  //   this.setData({
  //     inputName: e.detail.value
  //   })
  // },
  nameBindblur(e){
    console.log(e)
    this.setData({
      inputName: e.detail.value
    })
  },
  pwdBindblur(e) {
    console.log(e.detail.value)
    this.setData({
      inputPwd: e.detail.value
    })
  },
  handleActive: function (e) {
    var that = this
    if (this.data.inputName == '') {
      wx.showToast({
        title: '用户名不能为空，请输入用户名',
        icon: 'none'
      })
    } else if (this.data.inputPwd == '') {
      wx.showToast({
        title: '密码不能为空，请输入密码',
        icon: 'none'
      })
    }
    else {
      console.log(e)
      var userInfo = wx.getStorageSync('userInfo')
      const wxId = userInfo.unionId
      const scId = this.data.inputName
      wx.request({
        url: api.Login,
        method: 'POST',
        data: {
          username: that.data.inputName,
          password: that.data.inputPwd,
          userType: 0
        }, success: function (e) {

          console.log(e)
          switch (e.statusCode) {
            case 401:
              wx.showToast({
                title: '用户名和密码不匹配',
                icon: 'none'
              })
              break;
            case 200:
              // wx.setStorage({
              //   key: 'token',
              //   data: e.data.dataOption.token
              // })
              wx.setStorageSync('token', e.data.dataOption.token)
              wx.setStorageSync('userName', that.data.inputName)
              wx.setStorageSync('userPwd', that.data.inputPwd)
              wx.request({
                url: 'https://wit.weichai.com/user/associateWithSc/' + wxId + "/" + scId,
                success: function (e) {
                  switch (e.data.code) {
                    case 1:
                      console.log(e)
                      wx.showToast({
                        title: '激活成功',
                        icon: 'success'
                      })
                      wx.switchTab({
                        url: '/pages/fleet/fleet',
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
                        title: '此码已被激活，激活失败',
                        icon: 'none'
                      })
                    default:
                      wx.showToast({
                        title: e.data.msg,
                        icon: 'none'
                      })
                      break
                  }
                }
              })
              break;
            default:
              wx.showToast({
                title: e.data.message,
                icon: 'none'
              })
              break
          }

        },
        fail: function (e) {
          console.log(e)
          wx.showToast({
            title: "用户名或密码错误",
            icon: 'none'
          })
        }
      })

    }
  },
  // 密码框失去焦点时
  bindblur: function (e) {
    this.setData({
      pwd_val: e.detail.value
    })
  },
  // 密码显示隐藏
  isShow: function () {
    this.setData({
      isPassWord: !this.data.isPassWord
    })
  },
})