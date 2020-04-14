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
    trackId: '',
    carNumber: null,
    detailInfo: [],
    isGps: true,
    playIndex: 0,
    timer: null,
    length:null,
    times:[],
    isPlay: false,
    isActiveStop: false,

    //初始中心点经纬度设置
    latitude: 36.099994,
    longitude: 119.324520,
    markers: [
      {
        iconPath: '../../images/start.png',
        width: 24, //标注图标（icon）的宽度高度
        height: 24,
        alpha:0,
        anchor: { x: 0.5, y: 1 } ,
        id: 0,
        latitude: null,
        longitude: null,
        title: null,
    
        // label: {
        //   content: '起点',
        //   color: "#22B14C",
        //   bgColor: "#FFFFFF",
        //   fontSize: 14
        // },
        callout: {
          content: null,
          color: "#000000",
          fontSize: 13,
          borderRadius: 2,
          bgColor: "#fff",
          display: "ALWAYS",
          boxShadow: "5px 5px 10px #aaa"
        }    
      },
      {
        iconPath: '../../images/end.png',
        width: 24, //标注图标（icon）的宽度高度
        height: 24,
        // alpha: 0,
        anchor: { x: 0.5, y: 1 },
        id: 1,
        latitude: null,
        longitude: null,
        // label: {
        //   content: '终点',
        //   color: "#ED1C24",
        //   bgColor: "#FFFFFF",
        //   fontSize: 14
        // }
      }],
    polyline: [{
      points: [],
      color: "#42F11B",
      width: 4,
      dottedLine: true
    }]

  },
  regionchange(e) {
    //console.log(e.type)
  },
  markertap(e) {
    //console.log(e.markerId)
  },
  controltap(e) {
    //console.log(e.controlId)
  },
  handlePlay(e){
    console.log(e)
 //   let isPlay = !this.data.isPlay;
    this.setData({
      isPlay: !this.data.isPlay,
    })
    if(this.data.isPlay){
      this.beginTrack();
    } else {
      this.pauseTrack();
    }
  },

  // ！注意： 后台gps数据起点是索引值最大的那个点，终点是索引值为0的点。
  /**
    * 开始
    */
  beginTrack: function () {
    var that = this;
    this.setData({
      isActiveStop: false,
    })
    var index = that.data.length - 1; //最大索引值
    var i = (that.data.playIndex === 0) ? 0 : that.data.playIndex; //i:播放至索引值为i的定位点

  // ** 待赋值变量
    var marker_lat = 'markers[' + 0 + '].latitude'
    var marker_lng = 'markers[' + 0 + '].longitude'
    var title = 'markers[' + 0 + '].title'
    var content = 'markers[' + 0 + '].callout.content'
   
    // 首先判断轨迹点是否为空，如果不为空，说明有轨迹，播放按钮才有效，否则播放按钮禁用。
    if(this.data.polyline[0].points.length !== 0){
      if (that.data.timer == null) { //判断当前页面是否已有定时器任务，如果没有，方才开启定时器设定任务。
        that.timer = setInterval(function () {  //timer是该函数的返回值
          i++; //实际后台获取的数据索引0是否是终点
          that.setData({
            timer: that.timer,
            playIndex: i,
            latitude: that.data.polyline[0].points[index - i].latitude,
            longitude: that.data.polyline[0].points[index - i].longitude,
            [marker_lat]: that.data.polyline[0].points[index - i].latitude,
            [marker_lng]: that.data.polyline[0].points[index - i].longitude,
            [content]: that.data.carNumber + ' \n' + that.data.times[index - i]
          });
          //判断是否播放至终点标记点，i=length-1时，如果当前定位点是终点，则触发end结束操作
          if ((i + 1) >= (that.data.polyline[0].points.length)) {
            that.endTrack();
          }
        }, 1000)
      } 
    } else{
      wx.showToast({
        title: '无有效轨迹点，无法播放！',
        icon: 'none',
        duration: 5000
      })
      this.setData({
        isPlay: false
      })
    }

  },
  /**
     * 暂停
     */
  pauseTrack: function () {
    var that = this;
    that.setData({
      timer: null,
    })
    clearInterval(this.timer)  //取消定时周期任务函数setInterval()
  },
  /**
 * 结束
 */
  endTrack: function () {
    var that = this;
   // let isActiveStop = !this.data.isActiveStop;
    //  待赋值变量
    var marker_lat = 'markers[' + 0 + '].latitude'
    var marker_lng = 'markers[' + 0 + '].longitude'
    var title = 'markers[' + 0 + '].title'
    var content = 'markers[' + 0 + '].callout.content'
    if (this.data.polyline[0].points.length !== 0){ //同样判断停止播放按钮是否满足开启条件
      that.setData({
        //结束时，marker[0]需要回到起点
        isActiveStop: !this.data.isActiveStop,
        isPlay: false,
        playIndex: 0,
        timer: null,
        latitude: that.data.polyline[0].points[that.data.length - 1].latitude,
        longitude: that.data.polyline[0].points[that.data.length - 1].longitude,
        [marker_lat]: that.data.polyline[0].points[that.data.length - 1].latitude,
        [marker_lng]: that.data.polyline[0].points[that.data.length - 1].longitude,
        [content]: that.data.carNumber + ' \n' + that.data.times[0]
      });
    }
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // 将历史轨迹id赋值给页面data对象
    this.setData({
      trackId: options.trackId,
      carNumber: options.carNumber
    })
    var that = this
    wx.showLoading()
    wx.request({
      url: api.GetTrackDetailByID + '/' + options.trackId,
      method: 'get',
      // data:{
      //   trackId: options.trackId
      // },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res)

        var startTime = util.formatTime(new Date(parseInt(res.data.dataOption.startTime)))
        var endTime = util.formatTime(new Date(parseInt(res.data.dataOption.endTime)))

        var detailArray = {
          // 位置信息：gpsList-数组，数组的每个元素是一个对象
          gpsList: res.data.dataOption.gpsList, //时间戳与经纬度
          startTime: startTime,
          endTime: endTime,
          startAddress: res.data.dataOption.startAddress,
          endAddress: res.data.dataOption.endAddress,
          mileage: res.data.dataOption.mileage,
          sumHour: res.data.dataOption.sumHour,
          socChange: res.data.dataOption.socChange
        }
        // 1,工况信息数据赋值
        that.setData({
          detailInfo: detailArray,
        })
        wx.hideLoading()
        // gpsList[0]为终点；gpsList[gpsList.length-1]为起点        
        var points = []
        var times = []
        // 判断gps是否有数据，如有数据则进行轨迹绘制操作；如为null,则抛出异常，提醒用户
        if (res.data.dataOption.gpsList !== null) {
          for (var i = 0; i < detailArray.gpsList.length; i++) {
            // 剔除定位点错误的位置信息点
            if (detailArray.gpsList[i].lng !== "0" && detailArray.gpsList[i].lat !== "0" && detailArray.gpsList[i].lng !== null && detailArray.gpsList[i].lat !== null) {
              // points[i] = utilws.transformFromWGSToGCJ(parseFloat(detailArray.gpsList[i].lat), parseFloat(detailArray.gpsList[i].lng))   错误的示范
              points.push(utilws.transformFromWGSToGCJ(
                parseFloat(detailArray.gpsList[i].lat), parseFloat(detailArray.gpsList[i].lng)
              ))
              times.push( util.formatTime(new Date(parseInt(detailArray.gpsList[i].time))) )
            }
          }
          var length = points.length
          // console.log(points)
         // console.log(times[length-1])
          var point = 'polyline[' + 0 + '].points'
          var markerstart_lat = 'markers[' + 0 + '].latitude'
          var markerstart_lng = 'markers[' + 0 + '].longitude'
          var markerend_lat = 'markers[' + 1 + '].latitude'
          var markerend_lng = 'markers[' + 1 + '].longitude'
          var title = 'markers[' + 0 + '].title'
          var content = 'markers[' + 0 + '].callout.content'
          if (points.length > 0) {
            //2，轨迹点数据赋值
            that.setData({
              // polyline.points: points
              [point]: points,
              times: times,
              length: length,
              [markerstart_lat]: points[points.length - 1].latitude,
              [markerstart_lng]: points[points.length - 1].longitude,
              [markerend_lat]: points[0].latitude,
              [markerend_lng]: points[0].longitude,
              latitude: points[0].latitude,
              longitude: points[0].longitude,
              [title]:that.data.carNumber,
              [content]: that.data.carNumber + ' \n' + times[points.length - 1]

            })
          } else {
            wx.showToast({
              title: '当前驾驶循环的轨迹信息无效',
              icon: 'none',
              duration: 5000
            })
          }
        } else {
          that.setData({
            isGps: false
          })
          wx.showToast({
            title: '当前驾驶循环无轨迹信息',
            icon: 'none',
            duration: 5000
          })

        }
        // console.log([point])
        // console.log(that.data.polyline)
        // console.log(that.data.polyline[0].points)
        // console.log(that.data.markers)
      },
      fail: function() {
        wx.showToast({
          title: '数据异常',
          icon: 'none'
        })
      }
    })

  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    console.log(this.data.timer)
    clearInterval(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(this.data.timer)
    clearInterval(this.data.timer)
  },

})