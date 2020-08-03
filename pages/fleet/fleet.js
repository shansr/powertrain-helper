// pages/home/home.js
var api = require('../../config/api.js');
var app = getApp()
var loginTmr
Page({

  /**
   * 页面的初始数据
   */
  data: { //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    groups:[],
    functions: [],
    localPageindex: 1,
    localPageCount: 0,
    isActive: false,
    searchValue: '',
    isLogin: true, //是否登录
    isActivate: true //是否激活
  },
  functionItemClick(e) {
    // console.log(e)
    // app.globalData.carNumber = e.currentTarget.dataset.data.carNumber == null ? e.currentTarget.dataset.data.vin : e.currentTarget.dataset.data.carNumber
    // wx.navigateTo({
    //   url: e.currentTarget.dataset.data.url + '?carId=' + e.currentTarget.dataset.data.carId + '&carNumber=' + e.currentTarget.dataset.data.carNumber + '&vin=' + e.currentTarget.dataset.data.vin,
    // })
    wx.navigateTo({
      // url: '/pages/home/home?groupId=' + e.currentTarget.dataset.groupid,
      url: '/pages/fleet_vehicle/fleet_vehicle?groupId=' + e.currentTarget.dataset.groupid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //是否激活?
    //如果未激活，如果未激活isActive=false,反之isActive=true,
    //如果isActive=true,加载数据
    //如果isActive=fasle,


    //判断用户是否已经登录

    const unionId = wx.getStorageSync('userInfo').unionId
    const userName = wx.getStorageSync('userName')


    if ((unionId != undefined) && (userName != '')) {
      loginTmr = setInterval(function () {
        wx.request({
          url: api.Login,
          method: 'post',
          data: {
            username: wx.getStorageSync('userName'),
            password: wx.getStorageSync('userPwd'),
            userType: 0
          }, success: function (e) {
            wx.setStorage({
              key: 'token',
              data: e.data.dataOption.token
            })
          }
        })
      }, 60000)

      this.setData({
        isActive: true,
        isActivate: true,
        isLogin: true
      })
      // this.getFleet()
      this.showData()
    } else if ((unionId == undefined) && (userName == '')) {

      this.setData({
        isActive: false,
        isLogin: false,
      })
    } else if ((unionId != undefined) && (userName == '')) {
      this.setData({
        isActive: false,
        isLogin: true,
        isActivate: false
      })
    }
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
    if (this.data.isActive == false) {
      const unionId = wx.getStorageSync('userInfo').unionId
      const userName = wx.getStorageSync('userName')
      if ((unionId != undefined) && (userName != '')) {
        // this.getFleet()
        this.showData()
        this.setData({
          isActive: true,
          isActivate: true,
          isLogin: true
        })
      }
      else if ((unionId == undefined) && (userName == '')) {
        this.setData({
          isActive: false,
          isLogin: false,
        })
      } else if ((unionId != undefined) && (userName == '')) {
        this.setData({
          isActive: false,
          isLogin: true,
          isActivate: false
        })
      }
    }
    //如果isActive=false,
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
    clearInterval(loginTmr)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    this.showData()
    // wx.request({
    //   url: api.GetCarList,
    //   data: {
    //     pageIndex: 1,
    //     pageCount: 10,
    //     queryType: "weChat"
    //   },
    //   header: {
    //     token: wx.getStorageSync("token")
    //   },
    //   success: function (e) {
    //     that.setData({
    //       localPageindex: 1
    //     })
    //     var carArray = [];
    //     for (var i = 0; i < e.data.dataOption.dataRows.length; i++) {
    //       // if (e.data.dataOption.dataRows[i].carNumber!=null){
    //       var obj = {
    //         carNumber: e.data.dataOption.dataRows[i].carNumber == null ? e.data.dataOption.dataRows[i].vin : e.data.dataOption.dataRows[i].carNumber,
    //         online: e.data.dataOption.dataRows[i].online,
    //         terminal: e.data.dataOption.dataRows[i].terminal,
    //         vin: e.data.dataOption.dataRows[i].vin,
    //         carId: e.data.dataOption.dataRows[i].id,
    //         url: '/pages/vehicle/vehicle'
    //       }
    //       carArray.push(obj)
    //       // }

    //     }
    //     that.setData({
    //       functions: carArray,
    //       localPageCount: e.data.dataOption.pageCount
    //     })
    //     wx.stopPullDownRefresh()
    //   }
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if (this.data.localPageindex <= this.data.localPageCount) {
    //   this.setData({
    //     localPageindex: this.data.localPageindex + 1
    //   })
    //   wx.showLoading({
    //     title: '加载中',
    //   })
    //   var that = this
    //   wx.request({
    //     url: api.GetCarList,
    //     data: {
    //       searchText: that.data.searchValue,
    //       pageIndex: that.data.localPageindex,
    //       pageCount: 10,
    //       queryType: "weChat"
    //     },
    //     header: {
    //       token: wx.getStorageSync("token")
    //     },
    //     success: function (e) {
    //       var carArray = [];
    //       for (var i = 0; i < e.data.dataOption.dataRows.length; i++) {
    //         // if (e.data.dataOption.dataRows[i].carNumber !=null){
    //         var obj = {
    //           carNumber: e.data.dataOption.dataRows[i].carNumber == null ? e.data.dataOption.dataRows[i].vin : e.data.dataOption.dataRows[i].carNumber,
    //           online: e.data.dataOption.dataRows[i].online,
    //           terminal: e.data.dataOption.dataRows[i].terminal,
    //           vin: e.data.dataOption.dataRows[i].vin,
    //           carId: e.data.dataOption.dataRows[i].id,
    //           url: '/pages/vehicle/vehicle'
    //         }
    //         carArray.push(obj)
    //       }
    //       that.setData({
    //         functions: that.data.functions.concat(carArray)
    //       })
    //       wx.hideLoading()
    //     },
    //     fail: function (res) {
    //       wx.hideLoading()
    //       wx.showToast({
    //         title: '数据异常',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     },
    //     complete: function (res) { }
    //   })
    // } else {
    //   wx.showToast({
    //     title: '没数据啦/(ㄒoㄒ)/~~',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
  },

  getFleet: function(){
    var that = this
    // wx.request({
    //   url: api.GetFleet,
    //   success: function(e){
    //     console.log(e)
    //   },fail:function(e){
    //     console.log(e)
    //   }
    // })



    var that = this
    wx.request({
      url: api.Login,
      method: 'post',
      data: {
        username: wx.getStorageSync('userName'),
        password: wx.getStorageSync('userPwd'),
        userType: 0
      },
      success: function (res) {
        console.log(wx.getStorageSync('userPwd'))
        var token = res.data.dataOption.token
        var userId = res.data.dataOption.userId
        wx.setStorage({
          key: 'token',
          data: token
        })
        wx.setStorage({
          key: "userId",
          data: userId
        })
        wx.request({
          url: api.GetFleet,
          header: {
            token: token
          },
          success: function (e) {
            console.log(e)
          },
          fail: function (e) {
            wx.showToast({
              title: '服务器异常，请稍后再试',
              icon: 'none',
              duration: 5000
            })
          }
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '服务器异常，请稍后再试',
          icon: 'none',
          duration: 5000
        })
      }
    })
  },

  showData: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: api.Login,
      method: 'post',
      data: {
        username: wx.getStorageSync('userName'),
        password: wx.getStorageSync('userPwd'),
        userType: 0
      },
      success: function (res) {
        
        console.log(res)
        var token = res.data.dataOption.token
        var userId = res.data.dataOption.userId
        wx.setStorage({
          key: 'token',
          data: token
        })
        wx.setStorage({
          key: "userId",
          data: userId
        })
        wx.request({
          url: api.GetFleet,
          // data: {
          //   pageIndex: 1,
          //   pageCount: 10,
          //   queryType: "weChat"
          // },
          header: {
            token: token
          },
          success: function (e) {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            console.log('gp')
            console.log(e)
            var gps = []
            for(let i = 0 ; i < e.data.dataOption.length ; i++){
              var gp = e.data.dataOption[i]
              var item = {
                groupName: gp.groupName,
                groupId: gp.groupId,
                onlineNum: gp.onlineNum,
                allVehicleNum: gp.allVehicleNum,
                allMileage: gp.allMileage,
                zqh: gp.cdzqh
              }
              gps.push(item)
            }
            that.setData({
              groups: gps
            })
            // console.log(that.data.groups)

            // var carArray = [];
            // for (var i = 0; i < e.data.dataOption.dataRows.length; i++) {
            //   // if (e.data.dataOption.dataRows[i].carNumber != null){
            //   var obj = {
            //     carNumber: e.data.dataOption.dataRows[i].carNumber == null ? e.data.dataOption.dataRows[i].vin : e.data.dataOption.dataRows[i].carNumber,
            //     online: e.data.dataOption.dataRows[i].online,
            //     terminal: e.data.dataOption.dataRows[i].terminal,
            //     vin: e.data.dataOption.dataRows[i].vin,
            //     carId: e.data.dataOption.dataRows[i].id,
            //     url: '/pages/vehicle/vehicle'
            //   }
            //   carArray.push(obj)
            //   // }
            // }
            // that.setData({
            //   functions: carArray,
            //   localPageCount: e.data.dataOption.pageCount
            // })
          },
          fail: function (e) {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            wx.showToast({
              title: '服务器异常，请稍后再试',
              icon: 'none',
              duration: 5000
            })
          }
        })
      },
      fail: function (e) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常，请稍后再试',
          icon: 'none',
          duration: 5000
        })
      }
    })
  },
  InputChange(e) {
    this.setData({
      searchValue: e.detail.value
    })
    var that = this
    wx.request({
      url: api.GetCarList,
      data: {
        pageIndex: 1,
        pageCount: 10,
        queryType: "weChat",
        searchText: e.detail.value
      },
      header: {
        token: wx.getStorageSync("token")
      },
      success: function (e) {
        that.setData({
          localPageindex: 1
        })
        var carArray = [];
        for (var i = 0; i < e.data.dataOption.dataRows.length; i++) {
          //if (e.data.dataOption.dataRows[i].carNumber != null) {
          var obj = {
            carNumber: e.data.dataOption.dataRows[i].carNumber == null ? e.data.dataOption.dataRows[i].vin : e.data.dataOption.dataRows[i].carNumber,
            online: e.data.dataOption.dataRows[i].online,
            terminal: e.data.dataOption.dataRows[i].terminal,
            vin: e.data.dataOption.dataRows[i].vin,
            carId: e.data.dataOption.dataRows[i].id,
            url: '/pages/vehicle/vehicle'
            //}
          }
          carArray.push(obj)
        }
        if (carArray.length === 0) {
          wx.showToast({
            title: '无数据',
            icon: 'none'
          })
        }
        that.setData({
          functions: carArray,
          localPageCount: e.data.dataOption.pageCount
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  // doLogin() {
  //   wx.switchTab({
  //     url: '/pages/my/my',
  //   })
  // },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
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
              //成功获取sessionKey和openid
              wx.getUserInfo({
                //成功获取sessionKey和OpenId
                success: res => {
                  //解密数据获取unionId
                  wx.request({
                    url: 'https://wit.weichai.com/wxAuth/decrypt',
                    data: {
                      sessionKey: soRes.data.session_key,
                      data: res.encryptedData,
                      iv: res.iv
                    },
                    success: function (decryptRes) {
                      userInfo.unionId = decryptRes.data.unionId
                      wx.setStorageSync("userInfo", userInfo)
                      //解密成功,根据unionId获取用户信息，如果没有则注册
                      wx.request({
                        url: 'https://wit.weichai.com/user/getByWxId/' + decryptRes.data.unionId,
                        success: function (getRes) {
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
                                wx.hideLoading();
                                //授权成功后
                                thisCtx.setData({
                                  // isActive: true,
                                  isActivate: false,
                                  isLogin: true
                                })
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
                            userInfo.phone = ''
                            wx.setStorageSync("userInfo", userInfo)
                            wx.hideLoading();
                            thisCtx.setData({
                              // isActive: true,
                              isActivate: false,
                              isLogin: true
                            })
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

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    }
  },
  doCode() {
    wx.navigateTo({
      url: '/pages/vehicle/code/code',
    })
  },
  doCount() {
    wx.navigateTo({
      url: '/pages/bind/bind',
    })
  },

})