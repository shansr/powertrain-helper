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
    faults: [],
    carNumber: '',
    vin: '',
    carId: '',
    //整车变量
    carbra: '--',
    carbst: '--',
    carcha: '--',
    carcur: '--',
    cardcd: '--',
    cardri: '--',
    cargas: '--',
    cargea: '--',
    carodometer: '--',
    carpre: '--',
    carres: '--',
    carrun: '--',
    carsoc: '--',
    carspe: '--',
    carsta: '--',
    //驱动电机变量
    elemid: '--',
    electe: '--',
    elecur: '--',
    elemte: '--',
    elepre: '--',
    elermp: '--',
    elesta: '--',
    eletor: '--',
    //燃料电池变量
    cellcur: '--',
    celldcs: '--',
    cellflu: '--',
    cellhde: '--',
    cellhds: '--',
    cellhpr: '--',
    cellhps: '--',
    cellhte: '--',
    cellhtp: '--',
    cellpre: '--',
    cellpnu: '--',
    cellpls: '--',
    //发动机变量
    enginsta: '--',
    enginrpm: '--',
    enginflu: '--',
    ssqh:'--',

    // carNumber: null,
    timer: '',
    current: 'condition',
    current_scroll: 'condition',
    latitude: 0,
    longitude: 0,
    monitorInfo: [],

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

  handleChange({ detail }) {
    var that = this
    this.setData({
      current: detail.key
    });
    if (this.data.current == 'history') {
      wx.navigateTo({
        url: '/pages/history/history' + '?carId=' + this.data.carId + '&carNumber=' + this.data.carNumber
      })
      this.setData({
        current: 'condition'
      })
    } else if (this.data.current == 'statistic') {

      wx.navigateTo({
        url: '/pages/statistic/statistic' + '?carId=' + this.data.carId + '&carNumber=' + this.data.carNumber + '&vin=' + this.data.vin
      })
      this.setData({
        current: 'condition'
      })
    } else if (this.data.current == 'fault') {
      wx.showLoading({
        title: '故障码读取中'
      })
      wx.request({
        url: api.GetDtcInfo,
        data: {
          vehicleId: that.data.carId,
          startTime: that.data.startTimeStamp,
          endTime: that.data.endTimeStamp
        }, header: {
          token: wx.getStorageSync('token')
        }, success: function (e) {
          wx.hideLoading()
          if (e.data.dataOption.length == 0) {
            that.setData({
              current: 'condition'
            })
            wx.showToast({
              title: '无故障',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              faults: e.data.dataOption
            })
          }
        }, fail: function (e) {

        }
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


    var myDate = new Date()
    //往前推10天
    const n = 10
    var a = new Date(myDate)
    a = a.valueOf()
    var b = a - n * 24 * 60 * 60 * 1000
    this.setData({
      startTimeStamp: parseInt(a / 1000),
      endTimeStamp: parseInt(b / 1000),
      carId: options.carId,
      vin: options.vin,
      carNumber: options.carNumber
    })


    // this.setData({
    //   carNumber: options.carNumber,
    //   carId: options.carId,
    //   vin: options.vin
    // })

    //获取位置信息
    mapCtx = wx.createMapContext('myMap')
    var that = this
    wx.showLoading()
    wx.request({
      url: api.GetMonitorInfoByVin,
      method: 'get',
      data: {
        vin: options.vin,
        type: 1
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        var content = that.data.carNumber
        console.log(res.data.dataOption.length)
        if (res.data.dataOption.ssqh != undefined && res.data.dataOption.ssqh != null){
          that.setData({
            ssqh: parseFloat(res.data.dataOption.ssqh).toFixed(2)
          })
        }
        //燃料电池变量不为空
        if (res.data.dataOption.fd != undefined && res.data.dataOption.fd != null) {
          console.log("燃料电池数据")
          //燃料电池数据
          var cellInfo = JSON.parse(res.data.dataOption.fd)
          console.log(cellInfo.pls.length)
   
          that.setData({

            cellcur: parseFloat(cellInfo.cur).toFixed(1) ,
            celldcs: cellInfo.dcs,
            cellflu: cellInfo.flu,
            cellhde: cellInfo.hde,
            cellhds: cellInfo.hds,
            cellhpr: cellInfo.hpr,
            cellhps: cellInfo.hps,
            cellhte: cellInfo.hte,
            cellhtp: cellInfo.htp,
            cellpre: parseFloat(cellInfo.pre).toFixed(1) ,
            cellpnu: cellInfo.pnu,
            cellpls: cellInfo.pls,
          })
        }
        //驱动电机数据不为空
        if (res.data.dataOption.dm != undefined && res.data.dataOption.dm != null) {
          var electricInfo = JSON.parse(res.data.dataOption.dm)
          electricInfo = electricInfo[0]
          that.setData({
            elemid: electricInfo.mid,
            electe: electricInfo.cte,
            elecur: electricInfo.cur,
            elemte: electricInfo.mte,
            elepre: electricInfo.pre,
            elermp: electricInfo.rmp,
            elesta: electricInfo.sta,
            eletor: parseFloat(electricInfo.tor).toFixed(1) ,
          })
        }
        if (res.data.dataOption.vd != undefined && res.data.dataOption.vd != null) {
          var totalCarInfo = JSON.parse(res.data.dataOption.vd)
          that.setData({
            //整车数据
            carbra: totalCarInfo.bra,
            carbst: totalCarInfo.bst,
            cargea: totalCarInfo.gea,
            carcha: totalCarInfo.cha,
            carcur: totalCarInfo.cur,
            cardcd: totalCarInfo.dcd,
            cardri: totalCarInfo.dri,
            cargas: totalCarInfo.gas,
            carpre: totalCarInfo.pre,
            carrun: totalCarInfo.run,
            carres: totalCarInfo.res,
            carodometer: totalCarInfo.odometer,
            carsoc:parseFloat(totalCarInfo.soc).toFixed(1) ,
            carsta: totalCarInfo.sta,
            carspe: totalCarInfo.spe,
          })

        }
        if (res.data.dataOption.ed != undefined && res.data.dataOption.ed != null) {
          var engineInfo = JSON.parse(res.data.dataOption.ed)
          that.setData({
            // 发动机变量
            enginsta: engineInfo.sta,
            enginrpm: engineInfo.rpm,
            enginflu: engineInfo.flu,
          })
        }

        if (res.data.dataOption.pi != null && res.data.dataOption.pi != undefined) {
          console.log("位置有")
          //位置信息
          var positionInfo = JSON.parse(res.data.dataOption.pi)
          //设置地图marker显示
          var point = util.transformFromWGSToGCJ(parseFloat(positionInfo.latitude), parseFloat(positionInfo.longtitude))
          console.log(point)
          var content = that.data.carNumber
          console.log(electricInfo.mid)
          that.setData({
            latitude: point.latitude,
            longitude: point.longitude,
            'markers[0].latitude': point.latitude,
            'markers[0].longitude': point.longitude,
            'markers[0].callout.content': content
          })
          // console.log(that.data.monitorInfo)
          wx.hideLoading()
        } else {
          console.log("位置无")
          wx.hideLoading()

          var content = that.data.carNumber
          //获取用户位置信息
          if (wx.getStorageSync('location')) {
            console.log("获取缓存位置")
            var location = wx.getStorageSync('location')
            that.setData({
              //整车数据

              latitude: location.latitude,
              longitude: location.longitude,
              'markers[0].latitude': location.latitude,
              'markers[0].longitude': location.longitude,
              'markers[0].callout.content': content
            })
            console.log(that.data.markers)
          } else {
            console.log("手动获取位置")
            wx.hideLoading()

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
      //获取位置信息
    mapCtx = wx.createMapContext('myMap')
 
    wx.request({
      url: api.GetMonitorInfoByVin,
      method: 'get',
      data: {
        vin: that.data.vin,
        type: 1
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        var content = that.data.carNumber
        console.log(res.data.dataOption.length)
        if (res.data.dataOption.ssqh != undefined && res.data.dataOption.ssqh != null){
          that.setData({
            ssqh: parseFloat(res.data.dataOption.ssqh).toFixed(2)
          })
        }
        //燃料电池变量不为空
        if (res.data.dataOption.fd != undefined && res.data.dataOption.fd != null) {
          console.log("燃料电池数据")
          //燃料电池数据
          var cellInfo = JSON.parse(res.data.dataOption.fd)
          console.log(cellInfo.pls.length)
   
          that.setData({

            cellcur: parseFloat(cellInfo.cur).toFixed(1) ,
            celldcs: cellInfo.dcs,
            cellflu: cellInfo.flu,
            cellhde: cellInfo.hde,
            cellhds: cellInfo.hds,
            cellhpr: cellInfo.hpr,
            cellhps: cellInfo.hps,
            cellhte: cellInfo.hte,
            cellhtp: cellInfo.htp,
            cellpre: parseFloat(cellInfo.pre).toFixed(1) ,
            cellpnu: cellInfo.pnu,
            cellpls: cellInfo.pls,
          })
        }
        //驱动电机数据不为空
        if (res.data.dataOption.dm != undefined && res.data.dataOption.dm != null) {
          var electricInfo = JSON.parse(res.data.dataOption.dm)
          electricInfo = electricInfo[0]
          that.setData({
            elemid: electricInfo.mid,
            electe: electricInfo.cte,
            elecur: electricInfo.cur,
            elemte: electricInfo.mte,
            elepre: electricInfo.pre,
            elermp: electricInfo.rmp,
            elesta: electricInfo.sta,
            eletor: parseFloat(electricInfo.tor).toFixed(1) ,
          })
        }
        if (res.data.dataOption.vd != undefined && res.data.dataOption.vd != null) {
          var totalCarInfo = JSON.parse(res.data.dataOption.vd)
          that.setData({
            //整车数据
            carbra: totalCarInfo.bra,
            carbst: totalCarInfo.bst,
            cargea: totalCarInfo.gea,
            carcha: totalCarInfo.cha,
            carcur: totalCarInfo.cur,
            cardcd: totalCarInfo.dcd,
            cardri: totalCarInfo.dri,
            cargas: totalCarInfo.gas,
            carpre: totalCarInfo.pre,
            carrun: totalCarInfo.run,
            carres: totalCarInfo.res,
            carodometer: totalCarInfo.odometer,
            carsoc:parseFloat(totalCarInfo.soc).toFixed(1) ,
            carsta: totalCarInfo.sta,
            carspe: totalCarInfo.spe,
          })

        }
        if (res.data.dataOption.ed != undefined && res.data.dataOption.ed != null) {
          var engineInfo = JSON.parse(res.data.dataOption.ed)
          that.setData({
            // 发动机变量
            enginsta: engineInfo.sta,
            enginrpm: engineInfo.rpm,
            enginflu: engineInfo.flu,
          })
        }

        if (res.data.dataOption.pi != null && res.data.dataOption.pi != undefined) {
          console.log("位置有")
          //位置信息
          var positionInfo = JSON.parse(res.data.dataOption.pi)
          //设置地图marker显示
          var point = util.transformFromWGSToGCJ(parseFloat(positionInfo.latitude), parseFloat(positionInfo.longtitude))
          console.log(point)
          var content = that.data.carNumber
          console.log(electricInfo.mid)
          that.setData({
            latitude: point.latitude,
            longitude: point.longitude,
            'markers[0].latitude': point.latitude,
            'markers[0].longitude': point.longitude,
            'markers[0].callout.content': content
          })
          // console.log(that.data.monitorInfo)
          wx.hideLoading()
        } else {
          console.log("位置无")
          wx.hideLoading()

          var content = that.data.carNumber
          //获取用户位置信息
          if (wx.getStorageSync('location')) {
            console.log("获取缓存位置")
            var location = wx.getStorageSync('location')
            that.setData({
              //整车数据

              latitude: location.latitude,
              longitude: location.longitude,
              'markers[0].latitude': location.latitude,
              'markers[0].longitude': location.longitude,
              'markers[0].callout.content': content
            })
            console.log(that.data.markers)
          } else {
            console.log("手动获取位置")
            wx.hideLoading()

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
      // 使用递归，重新执行定时器
      that.onShow
    }, 2000)
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