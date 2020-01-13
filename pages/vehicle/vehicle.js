// pages/vehicle/vehicle.js
var api = require('../../config/api.js');
var app = getApp();
var mapCtx
var util = require('../../utils/WSCoordinate.js')
var timerTem
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zdy:'',
    zdl:'',
    dw: '',
    cs: '',
    jydz: '',
    soc:'',
    djnj: '',
    djzs: '',
    zxslc:'',
    znh:'',
    dcdy:'',
    djwd: '',
    kzqwd: '',
    qqpyl:'', 
    carId: '',
    carNumber: null,
    timer: '',
    current: 'condition',
    current_scroll: 'condition',
    latitude: 0,
    longitude: 0,
    monitorInfo: [],
    vehicleInfo: [],
    // 标记点 当前位置
    markers: [{
      iconPath: '../../images/CAR.png',
      callout: {
        display: 'ALWAYS',
        textAlign: 'left',
        padding: 4
      },
      latitude: 0,
      longitude: 0
    }],
  },

  handleChange({detail}) {
    this.setData({
      current: detail.key
    });
    if (this.data.current == 'history') {
      wx.navigateTo({
        url: '/pages/history/history' + '?carId=' + this.data.carId + '&carNumber='+ this.data.carNumber
      })
      this.setData({
        current: 'condition'
      })
    } else if (this.data.current == 'statistic') {
      wx.navigateTo({
        url: '/pages/statistic/statistic' + '?carId=' + this.data.carId
      })
       this.setData({
        current: 'condition'
      })
    }
  },

  handleChangeScroll({
    detail
  }) {
    console.log(detail)
    this.setData({
      current_scroll: detail.key
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // app.globalData.carId=options.carId
    // console.log(app.globalData.carId)
    console.log(app.globalData.carNumber)
    console.log(options.vin)
    this.setData({
      carNumber: app.globalData.carNumber
    })

    //获取位置信息
    mapCtx = wx.createMapContext('myMap')
    var that = this
    wx.showLoading()
    wx.request({
      url: api.GetMonitorInfoByVin,
      method: 'get',
      data:{
        vin:app.globalData.vin,
        type:1
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data)
        var monitorAll = {}
        var monitorArray = []
        monitorAll = res.data.dataOption
        monitorArray.push(monitorAll)
        typeof (res.data.dataOption.location)
        if (monitorAll.location != null && monitorAll.location.lng != null && monitorAll.location.lat !=null) {
          //设置地图marker显示
          var point = util.transformFromWGSToGCJ(parseFloat(res.data.dataOption.location.lat), parseFloat(res.data.dataOption.location.lng)) 
          console.log(point)
          var content= that.data.carNumber
          that.setData({
            // monitorInfo: monitorArray,
            zdy: res.data.dataOption.zdy == null ? '未定义' : parseFloat(res.data.dataOption.zdy).toFixed(1),
            zdl: res.data.dataOption.zdl == null ? '未定义' : parseFloat(res.data.dataOption.zdl).toFixed(1),
            dw: res.data.dataOption.dw,
            cs: res.data.dataOption.cs == null ? '未定义' : parseFloat(res.data.dataOption.cs).toFixed(1),
            jydz: res.data.dataOption.jydz == null ? '未定义' : parseFloat(res.data.dataOption.jydz).toFixed(1),
            soc: res.data.dataOption.soc == null ? '未定义' : parseFloat(res.data.dataOption.soc).toFixed(1),
            djnj: res.data.dataOption.djnj == null ? '未定义' : parseFloat(res.data.dataOption.djnj).toFixed(1),
            djzs: res.data.dataOption.djzs == null ? '未定义' : parseFloat(res.data.dataOption.djzs).toFixed(1),
            zxslc: res.data.dataOption.zxslc == null ? '未定义' : parseFloat(res.data.dataOption.zxslc).toFixed(1),
            znh: res.data.dataOption.znh== null ? '未定义' : parseFloat(res.data.dataOption.znh).toFixed(1),
            dcdy: res.data.dataOption.dcdy == null ? '未定义' : parseFloat(res.data.dataOption.dcdy).toFixed(1),
            djwd: res.data.dataOption.djwd == null ? '未定义' : parseFloat(res.data.dataOption.djwd).toFixed(1),
            kzqwd: res.data.dataOption.kzqwd== null ? '未定义' : parseFloat(res.data.dataOption.kzqwd).toFixed(1),
            qqpyl: res.data.dataOption.qqpyl == null ? '未定义' : parseFloat(res.data.dataOption.qqpyl).toFixed(1), 
            latitude: point.latitude,
            longitude: point.longitude,
            'markers[0].latitude': point.latitude,
            'markers[0].longitude': point.longitude,
            'markers[0].callout.content': content
          })
          // console.log(that.data.monitorInfo)
          wx.hideLoading()
        } else {
          wx.hideLoading()
          var moniorData = parseFloat(res.data.dataOption)
          var content= that.data.carNumber
          //获取用户位置信息
          if (wx.getStorageSync('location')) {
            var location = wx.getStorageSync('location')
            that.setData({
              // monitorInfo: monitorArray,
              zdy: res.data.dataOption.zdy == null ? '未定义' : parseFloat(res.data.dataOption.zdy).toFixed(1),
              zdl: res.data.dataOption.zdl == null ? '未定义' : parseFloat(res.data.dataOption.zdl).toFixed(1),
              dw: res.data.dataOption.dw,
              cs: res.data.dataOption.cs == null ? '未定义' : parseFloat(res.data.dataOption.cs).toFixed(1),
              jydz: res.data.dataOption.jydz == null ? '未定义' : parseFloat(res.data.dataOption.jydz).toFixed(1),
              soc: res.data.dataOption.soc == null ? '未定义' : parseFloat(res.data.dataOption.soc).toFixed(1),
              djnj: res.data.dataOption.djnj == null ? '未定义' : parseFloat(res.data.dataOption.djnj).toFixed(1),
              djzs: res.data.dataOption.djzs == null ? '未定义' : parseFloat(res.data.dataOption.djzs).toFixed(1),
              zxslc: res.data.dataOption.zxslc == null ? '未定义' : parseFloat(res.data.dataOption.zxslc).toFixed(1),
              znh: res.data.dataOption.znh == null ? '未定义' : parseFloat(res.data.dataOption.znh).toFixed(1),
              dcdy: res.data.dataOption.dcdy == null ? '未定义' : parseFloat(res.data.dataOption.dcdy).toFixed(1),
              djwd: res.data.dataOption.djwd == null ? '未定义' : parseFloat(res.data.dataOption.djwd).toFixed(1),
              kzqwd: res.data.dataOption.kzqwd == null ? '未定义' : parseFloat(res.data.dataOption.kzqwd).toFixed(1),
              qqpyl: res.data.dataOption.qqpyl == null ? '未定义' : parseFloat(res.data.dataOption.qqpyl).toFixed(1), 
              latitude: location.latitude,
              longitude: location.longitude,
              'markers[0].latitude': location.latitude,
              'markers[0].longitude': location.longitude,
              'markers[0].callout.content': content
            })
            console.log(that.data.markers)
          } else {
            that.setData({
              zdy: res.data.dataOption.zdy == null ? '未定义' : parseFloat(res.data.dataOption.zdy).toFixed(1),
              zdl: res.data.dataOption.zdl == null ? '未定义' : parseFloat(res.data.dataOption.zdl).toFixed(1),
              dw: res.data.dataOption.dw,
              cs: res.data.dataOption.cs == null ? '未定义' : parseFloat(res.data.dataOption.cs).toFixed(1),
              jydz: res.data.dataOption.jydz == null ? '未定义' : parseFloat(res.data.dataOption.jydz).toFixed(1),
              soc: res.data.dataOption.soc == null ? '未定义' : parseFloat(res.data.dataOption.soc).toFixed(1),
              djnj: res.data.dataOption.djnj == null ? '未定义' : parseFloat(res.data.dataOption.djnj).toFixed(1),
              djzs: res.data.dataOption.djzs == null ? '未定义' : parseFloat(res.data.dataOption.djzs).toFixed(1),
              zxslc: res.data.dataOption.zxslc == null ? '未定义' : parseFloat(res.data.dataOption.zxslc).toFixed(1),
              znh: res.data.dataOption.znh == null ? '未定义' : parseFloat(res.data.dataOption.znh).toFixed(1),
              dcdy: res.data.dataOption.dcdy == null ? '未定义' : parseFloat(res.data.dataOption.dcdy).toFixed(1),
              djwd: res.data.dataOption.djwd == null ? '未定义' : parseFloat(res.data.dataOption.djwd).toFixed(1),
              kzqwd: res.data.dataOption.kzqwd == null ? '未定义' : parseFloat(res.data.dataOption.kzqwd).toFixed(1),
              qqpyl: res.data.dataOption.qqpyl == null ? '未定义' : parseFloat(res.data.dataOption.qqpyl).toFixed(1), 
            })
          
            wx.getLocation({
              type: 'gcj02',
              success(res) {
                console.log(res)
                var location = {}
                location.latitude = res.latitude
                location.longitude = res.longitude
                wx.setStorageSync("location", location)
                // console.log(wx.getStorageSync("location"))
                that.setData({
                  // monitorInfo: monitorArray,

                  latitude: res.latitude,
                  longitude: res.latitude,
                  'markers[0].latitude': res.latitude,
                  'markers[0].longitude': res.longitude,
                  'markers[0].callout.content': content
                })
                console.log(that.data.markers)
              }
            })
          }

        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '数据异常',
          icon: 'none',
          duration: 2000
        })
      }
    });
    //获取整机详情信息
    wx.request({
      url: api.GetCarDetailByID + '/' + that.data.carId,
      method: 'get',
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data)
        var detailInfo = []
        detailInfo.push(res.data.dataOption)
        that.setData({
          vehicleInfo: detailInfo
        })
        console.log(that.data.vehicleInfo)
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '数据异常',
          icon: 'none',
          duration: 2000
        })
      }
    })

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
    var that = this
    //设置定时器，每隔5秒刷新一次
    timerTem = setInterval(function () {

      // 获取位置信息
      mapCtx = wx.createMapContext('myMap')
      wx.request({
        url: api.GetMonitorInfoByVin,
        method: 'get',
        data:{
          vin:that.data.vin,
          type:1
        },
        header: {
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res.data)
          var monitorAll = {}
          var monitorArray = []
          monitorAll = res.data.dataOption
          monitorArray.push(monitorAll)
          typeof (res.data.dataOption.location)
          if (monitorAll.location != null && monitorAll.location.lng !=null && monitorAll.location.lat !=null) {
            //设置地图marker显示
            var point = util.transformFromWGSToGCJ(parseFloat(res.data.dataOption.location.lat), parseFloat(res.data.dataOption.location.lng))
           var content=that.data.carNumber
            console.log(point)
            that.setData({
              // monitorInfo: monitorArray,
        zdy: res.data.dataOption.zdy == null ? '未定义' : parseFloat(res.data.dataOption.zdy).toFixed(1),
            zdl: res.data.dataOption.zdl == null ? '未定义' : parseFloat(res.data.dataOption.zdl).toFixed(1),
            dw: res.data.dataOption.dw,
            cs: res.data.dataOption.cs == null ? '未定义' : parseFloat(res.data.dataOption.cs).toFixed(1),
            jydz: res.data.dataOption.jydz == null ? '未定义' : parseFloat(res.data.dataOption.jydz).toFixed(1),
            soc: res.data.dataOption.soc == null ? '未定义' : parseFloat(res.data.dataOption.soc).toFixed(1),
            djnj: res.data.dataOption.djnj == null ? '未定义' : parseFloat(res.data.dataOption.djnj).toFixed(1),
            djzs: res.data.dataOption.djzs == null ? '未定义' : parseFloat(res.data.dataOption.djzs).toFixed(1),
            zxslc: res.data.dataOption.zxslc == null ? '未定义' : parseFloat(res.data.dataOption.zxslc).toFixed(1),
            znh: res.data.dataOption.znh== null ? '未定义' : parseFloat(res.data.dataOption.znh).toFixed(1),
            dcdy: res.data.dataOption.dcdy == null ? '未定义' : parseFloat(res.data.dataOption.dcdy).toFixed(1),
            djwd: res.data.dataOption.djwd == null ? '未定义' : parseFloat(res.data.dataOption.djwd).toFixed(1),
            kzqwd: res.data.dataOption.kzqwd== null ? '未定义' : parseFloat(res.data.dataOption.kzqwd).toFixed(1),
            qqpyl: res.data.dataOption.qqpyl == null ? '未定义' : parseFloat(res.data.dataOption.qqpyl).toFixed(1), 
              latitude: point.latitude,
              longitude: point.longitude,
              'markers[0].latitude': point.latitude,
              'markers[0].longitude': point.longitude,
              'markers[0].callout.content': content
            })
            console.log(that.data.monitorInfo)
            wx.hideLoading()
          } else {
            wx.hideLoading()
            var content=that.data.carNumber
            //获取用户位置信息
            if (wx.getStorageSync('location')) {
              var location = wx.getStorageSync('location')
              that.setData({
                // monitorInfo: monitorArray,
                zdy: res.data.dataOption.zdy == null ? '未定义' : parseFloat(res.data.dataOption.zdy).toFixed(1),
                zdl: res.data.dataOption.zdl == null ? '未定义' : parseFloat(res.data.dataOption.zdl).toFixed(1),
                dw: res.data.dataOption.dw,
                cs: res.data.dataOption.cs == null ? '未定义' : parseFloat(res.data.dataOption.cs).toFixed(1),
                jydz: res.data.dataOption.jydz == null ? '未定义' : parseFloat(res.data.dataOption.jydz).toFixed(1),
                soc: res.data.dataOption.soc == null ? '未定义' : parseFloat(res.data.dataOption.soc).toFixed(1),
                djnj: res.data.dataOption.djnj == null ? '未定义' : parseFloat(res.data.dataOption.djnj).toFixed(1),
                djzs: res.data.dataOption.djzs == null ? '未定义' : parseFloat(res.data.dataOption.djzs).toFixed(1),
                zxslc: res.data.dataOption.zxslc == null ? '未定义' : parseFloat(res.data.dataOption.zxslc).toFixed(1),
                znh: res.data.dataOption.znh == null ? '未定义' : parseFloat(res.data.dataOption.znh).toFixed(1),
                dcdy: res.data.dataOption.dcdy == null ? '未定义' : parseFloat(res.data.dataOption.dcdy).toFixed(1),
                djwd: res.data.dataOption.djwd == null ? '未定义' : parseFloat(res.data.dataOption.djwd).toFixed(1),
                kzqwd: res.data.dataOption.kzqwd == null ? '未定义' : parseFloat(res.data.dataOption.kzqwd).toFixed(1),
                qqpyl: res.data.dataOption.qqpyl == null ? '未定义' : parseFloat(res.data.dataOption.qqpyl).toFixed(1), 
                latitude: location.latitude,
                longitude: location.longitude,
                'markers[0].latitude': location.latitude,
                'markers[0].longitude': location.longitude,
                'markers[0].callout.content': content
              })
              console.log(that.data.markers)
            } else {
              that.setData({
                zdy: res.data.dataOption.zdy == null ? '未定义' : parseFloat(res.data.dataOption.zdy).toFixed(1),
                zdl: res.data.dataOption.zdl == null ? '未定义' : parseFloat(res.data.dataOption.zdl).toFixed(1),
                dw: res.data.dataOption.dw,
                cs: res.data.dataOption.cs == null ? '未定义' : parseFloat(res.data.dataOption.cs).toFixed(1),
                jydz: res.data.dataOption.jydz == null ? '未定义' : parseFloat(res.data.dataOption.jydz).toFixed(1),
                soc: res.data.dataOption.soc == null ? '未定义' : parseFloat(res.data.dataOption.soc).toFixed(1),
                djnj: res.data.dataOption.djnj == null ? '未定义' : parseFloat(res.data.dataOption.djnj).toFixed(1),
                djzs: res.data.dataOption.djzs == null ? '未定义' : parseFloat(res.data.dataOption.djzs).toFixed(1),
                zxslc: res.data.dataOption.zxslc == null ? '未定义' : parseFloat(res.data.dataOption.zxslc).toFixed(1),
                znh: res.data.dataOption.znh == null ? '未定义' : parseFloat(res.data.dataOption.znh).toFixed(1),
                dcdy: res.data.dataOption.dcdy == null ? '未定义' : parseFloat(res.data.dataOption.dcdy).toFixed(1),
                djwd: res.data.dataOption.djwd == null ? '未定义' : parseFloat(res.data.dataOption.djwd).toFixed(1),
                kzqwd: res.data.dataOption.kzqwd == null ? '未定义' : parseFloat(res.data.dataOption.kzqwd).toFixed(1),
                qqpyl: res.data.dataOption.qqpyl == null ? '未定义' : parseFloat(res.data.dataOption.qqpyl).toFixed(1), 
              })
            
              wx.getLocation({
                type: 'gcj02',
                success(res) {
                  console.log(res)
                  var location = {}
                  location.latitude = res.latitude
                  location.longitude = res.longitude
                  wx.setStorageSync("location", location)
                  // console.log(wx.getStorageSync("location"))
                  that.setData({
                    // monitorInfo: monitorArray,
         
                    latitude: res.latitude,
                    longitude: res.latitude,
                    'markers[0].latitude': res.latitude,
                    'markers[0].longitude': res.longitude,
                    'markers[0].callout.content': content
                  })
                  console.log(that.data.markers)
                }
              })
            }

          }
        },
        fail: function (res) {
          wx.showToast({
            title: '数据异常',
            icon: 'none',
            duration: 2000
          })
        }
      });
      // 使用递归，重新执行定时器
      that.onShow
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     //写在onHide()中，切换页面或者切换底部菜单栏时关闭定时器。
    console.log('hidden')
    clearInterval(timerTem)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('关闭实时监控定时器')
    clearInterval(timerTem)
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
  getCarLocation: function () {


  }


})