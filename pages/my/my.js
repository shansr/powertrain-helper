// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageUrl: "",
    nickName: ""
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
    var thisCtx = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
        thisCtx.setData({
          hasUserInfo: true,
          imageUrl: res.data.imageUrl,
          nickName: res.data.nickName
        })
      },
    })
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
  getUserInfo() {
    var thisCtx = this
    //获取sessionkey和openid
    wx.login({
      success: function (loginRes) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        var userInfo = {}    
        wx.request({
          url: 'https://wit.weichai.com/wxAuth/getScAuthInfo/' + loginRes.code,
          success: function (soRes) {
            console.log(soRes)
            //成功获取sessionKey和openid
            wx.getUserInfo({
              //成功获取sessionKey和OpenId
              success: res => {
                //解密数据获取unionId
                console.log('user info')
                console.log(res)
                wx.request({
                  url: 'https://wit.weichai.com/wxAuth/decrypt',
                  data: {
                    sessionKey: soRes.data.session_key,
                    data: res.encryptedData,
                    iv: res.iv
                  },
                  success: function (decryptRes) {
                    console.log(decryptRes.data.unionId)
                    userInfo.unionId = decryptRes.data.unionId
                    wx.setStorageSync("userInfo", userInfo)
                    //解密成功,根据unionId获取用户信息，如果没有则注册
                    wx.request({
                      url: 'https://wit.weichai.com/user/getByWxId/' + decryptRes.data.unionId,
                      success: function (getRes) {
                        console.log(getRes)
                        //本地数据库中无此人
                        if (getRes.data.code == 2) {
                          //进行注册
                          wx.request({
                            url: 'https://wit.weichai.com/user/registerByWx',
                            data: {
                              wxId: decryptRes.data.unionId,
                              imageUrl: res.userInfo.avatarUrl,
                              nickName: res.userInfo.nickName
                            },
                            success: function (regRes) {
                              console.log(regRes)
                              // 设置本地变量
                              thisCtx.setData({
                                imageUrl: regRes.data.msg.imageUrl,
                                nickName: regRes.data.msg.nickName,
                                hasUserInfo: true
                              })
                              // // 写入本地存储
                              // var userInfo = {}
                              userInfo.imageUrl = regRes.data.msg.imageUrl
                              userInfo.nickName = regRes.data.msg.nickName
                              // userInfo.id = regRes.data.msg.id
                              userInfo.unionId = decryptRes.data.unionId
                              userInfo.phone = ''
                              userInfo.code = loginRes.code
                              wx.setStorageSync("userInfo", userInfo)
                              console.log(wx.getStorageSync('userInfo'))
                              wx.hideLoading();
                            }
                          })
                        } else if (getRes.data.code == 1) {
                          // 设置本地变量
                          thisCtx.setData({
                            imageUrl: getRes.data.msg.imageUrl,
                            nickName: getRes.data.msg.nickName,
                            hasUserInfo: true
                            
                          })
                          // 写入本地存储
                          // var userInfo = {}
                          userInfo.imageUrl = getRes.data.msg.imageUrl
                          userInfo.nickName = getRes.data.msg.nickName
                          // userInfo.id = getRes.data.msg.id
                         
                          userInfo.code = loginRes.code
                          userInfo.phone=''
                          wx.setStorageSync("userInfo", userInfo)
                          console.log(wx.getStorageInfoSync('userInfo'))
                          wx.hideLoading();
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})