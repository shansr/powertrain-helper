// pages/trackdetail/trackdetail.js
var api = require('../../config/api.js');
var util = require('../../utils/utils.js');
var utilws = require('../../utils/WSCoordinate.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取请求数据
    trackId:'',
    carNumber: null,
    detailInfo: [],
    isGps: true,
    // points: [],
    latitude: 36.099994,
    longitude: 119.324520,
    markers: [{
      id: 0,
      latitude: null,
      longitude: null,
      label: { content: '起点', color: "#22B14C", bgColor:"#FFFFFF", fontSize:14 }
    },
    {
      id: 1,
      latitude: null,
      longitude: null,
      label: { content: '终点', color: "#ED1C24", bgColor: "#FFFFFF", fontSize:14 }
    }],
    polyline: [{
      points: [],
      color: "#42F11B",
      width: 4,
      dottedLine: true
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    // 将历史轨迹id赋值给页面data对象
    this.setData({
      trackId: options.trackId,
      carNumber:options.carNumber
    })
    var that = this
    wx.request({
      url: api.GetTrackDetailByID + '/'+ options.trackId,
      method:'get',
      // data:{
      //   trackId: options.trackId
      // },
      header: {
        token: wx.getStorageSync('token')
      },
      success:function(res){
        console.log(res)
        wx.hideLoading()
     
        var startTime = util.formatTime(new Date(parseInt(res.data.dataOption.startTime)))
        var endTime = util.formatTime(new Date(parseInt(res.data.dataOption.endTime)))
        
        var detailArray = {
          // 位置信息：gpsList-数组，数组的每个元素是一个对象
          gpsList: res.data.dataOption.gpsList,
          startTime: startTime,
          endTime: endTime,
          startAddress: res.data.dataOption.startAddress,
          endAddress: res.data.dataOption.endAddress,
          mileage: res.data.dataOption.mileage,
          sumHour: res.data.dataOption.sumHour,
          socChange: res.data.dataOption.socChange,
          // totalEnergyConsumption: res.data.dataOption.totalEnergyConsumption,
          // hundredAveEnergyConsumption: res.data.dataOption.hundredAveEnergyConsumption
        }
        // 1,工况信息数据赋值
        that.setData({
          detailInfo: detailArray
        })
        // console.log(detailArray)
        // gpsList[0]为终点；gpsList[gpsList.length-1]为起点
        
        var points = []
        // 判断gps是否有数据，如有数据则进行轨迹绘制操作；如为null,则抛出异常，提醒用户
        if (res.data.dataOption.gpsList != null) {
          for (var i = 0; i < detailArray.gpsList.length; i++) {
            // 剔除定位点错误的位置信息点
            if (detailArray.gpsList[i].lng != "0" && detailArray.gpsList[i].lat !== "0" && detailArray.gpsList[i].lng !== null && detailArray.gpsList[i].lat !== null) {
              //console.log(detailArray.gpsList[i])
              // points[i] = utilws.transformFromWGSToGCJ(parseFloat(detailArray.gpsList[i].lat), parseFloat(detailArray.gpsList[i].lng))
              points.push(utilws.transformFromWGSToGCJ(parseFloat(detailArray.gpsList[i].lat), parseFloat(detailArray.gpsList[i].lng)))
              // points[i] = {
              //   longitude: points[i].longitude,
              //   latitude: points[i].latitude
              // }
              //console.log(i,points[i])
            }
          }
          console.log(points)
          var point = 'polyline[' + 0 + '].points'
          var markerstart_lat = 'markers[' + 0 + '].latitude'
          var markerstart_lng = 'markers[' + 0 + '].longitude'
          var markerend_lat = 'markers[' + 1 + '].latitude'
          var markerend_lng = 'markers[' + 1 + '].longitude'
          if(points.length > 0){
            //2，轨迹点数据赋值
            that.setData({
              // polyline.points: points
              [point]: points,
              [markerstart_lat]: points[points.length - 1].latitude,
              [markerstart_lng]: points[points.length - 1].longitude,
              [markerend_lat]: points[0].latitude,
              [markerend_lng]: points[0].longitude,
              latitude: points[0].latitude,
              longitude: points[0].longitude
            })
          }
        } else {
          that.setData({
            isGps: false
          })

          wx.showToast({
            title: '当前驾驶循环无轨迹信息',
            icon:'none',
            duration: 5000
          })

        }
        

        // console.log([point])
        // console.log(that.data.polyline)
        // console.log(that.data.polyline[0].points)
        // console.log(that.data.markers)
      }
    })

  }



})