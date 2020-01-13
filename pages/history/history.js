// pages/history/history.js
var api = require('../../config/api.js');
var util = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
// 1. 显示数据用
    historyLists:[],
    // 当前页面的索引值
    localPageindex: 1,
     // 当前请求数据的总页数
    localPageCount: 0,
    // 页面历史列表的时间段显示变量
    endTime: '',
    startTime: '',
    carID: '',
    carNumber: null,

// 2，时间选择器所用数据
    isPickerRender: false,
    isPickerShow: false,
    startTime: "2019-01-01 12:32:44",
    endTime: "2019-12-01 12:32:44",
    pickerConfig: {
      endDate: true,
      column: "second",
      dateLimit: true,
      initStartTime: "2019-01-01 12:32:44",
      initEndTime: "2019-12-01 12:32:44",
      limitStartTime: "2015-05-06 12:32:44",
      limitEndTime: "2055-05-06 12:32:44"
    }
  },

  trackItemClick(e) {
    // 组件传递过来的点击事件对象内容home.data=e.currentTarget.dataset.data
    console.log(e)
    wx.navigateTo({
      // 跳转页面并传入参数 trackId
      url: e.currentTarget.dataset.data.url + '?trackId=' + e.currentTarget.dataset.data.trackId + '&carNumber='+ this.data.carNumber
    })
  },

// 2时间选择器
  pickerShow: function () {
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function () {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    // let startDate = util.formatTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
    // let endDate = util.formatTime(new Date());
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
      // startDate,
      // endDate
    });
  },
  setPickerTime: function (val) {
    console.log(val);
    let data = val.detail;
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 获取开始时间默认值：当前时间戳毫秒级
    var timestamp = Date.parse(new Date());
    console.log('currenttimestamp', timestamp);
    // 传入new Date(某天的时间戳)参数，转换为日期时间格式
    var currentTime = util.formatTime(new Date());
    console.log('currentTime', currentTime);

    // 获取开始时间默认值：前n天时间戳
    var n = 1;
    var yester_timestamp = timestamp - n * 24 * 60 * 60 * 1000;
    // console.log('yester_timestamp', yester_timestamp);
    // 前n天时间戳转日期时间格式
    var yesterTime = util.formatTime(new Date(yester_timestamp));
    console.log('前n天日期', yesterTime);

    // // 通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      endTime: currentTime,
      startTime: yesterTime,
      carID: options.carId,
      carNumber:options.carNumber
    });

    var that = this
    wx.request({
      url: api.GetCarHistoryTrackByID,
      method: 'get',
      data: {
        carID: options.carId,
        // time是long类型的时间戳
        startTime: yester_timestamp,
        endTime: timestamp,
        queryType: 'weChat',
        pageIndex: 1,
        pageCount: 10
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        var historyArray =[];
        if (res.data.dataOption.dataCount !== '0' ){
          for (var i = 0; i < res.data.dataOption.dataRows.length; i++) {
            // 时间戳(string)转换为日期格式:要将string转为整型          
            var startTime = util.formatTime(new Date(parseInt(res.data.dataOption.dataRows[i].startTime))) 
            var endTime = util.formatTime(new Date(parseInt(res.data.dataOption.dataRows[i].endTime)))
      
            historyArray[i] = {
              startTime: startTime,
              endTime: endTime,
              sumHour: res.data.dataOption.dataRows[i].sumHour,
              sumMileage: res.data.dataOption.dataRows[i].sumMileage,
              // sumYH: res.data.dataOption.dataRows[i].sumYH,
              // hundredAverageConsume: res.data.dataOption.dataRows[i].hundredAverageConsume,
              trackId: res.data.dataOption.dataRows[i].id,
              url:'/pages/trackdetail/trackdetail'
            }
          }
          console.log(historyArray)
          that.setData({
            historyLists: historyArray,
            localPageCount: res.data.dataOption.pageCount
          })
        } else {
          wx.showToast({
            title: '当前时间段无历史轨迹信息',
            icon: 'none'
          })
        } 
      },
      fail: function () {
        wx.showToast({
          title: '数据异常',
          icon: 'none'
        })
      }
    })
  },

  // 2, 查询按钮触发事件：根据页面传入的用户选择时间段重新请求数据
  handleHistoryClick(event) {
    console.log(event)
    
    // 将页面传入的用户选择的起止日期时间转换为时间戳
    // ??????需要修改为传入的用户时间段（日期）
    // console.log(event.currentTarget.dataset.starttime)
    // console.log(event.currentTarget.dataset.endtime)
    
    this.setData({
      historyLists:[],
      localPageindex:1,
      localPageCount:0
    })
   // var format = data.replace()
    var start = event.currentTarget.dataset.starttime.replace(/-/g, '/')
    var end = event.currentTarget.dataset.endtime.replace(/-/g, '/')
    var user_startTime = Date.parse(new Date(start))
    var user_endTime = Date.parse(new Date(end))

    var that = this

    var requestData = {
      carID: this.data.carID,
      // time是long类型的时间戳
      startTime: user_startTime,
      endTime: user_endTime,
      queryType: 'weChat',
      pageIndex: 1,
      pageCount: 10
    }

    // wx.request({
    //   url: 'https://wit.weichai.com/user/log',
    //   data: {
    //     log: JSON.stringify(requestData)
    //   },
    //   success: function (e) {
    //     console.log(e)
    //   }
    // })
    wx.request({
      url: api.GetCarHistoryTrackByID,
      method: 'get',
      data: requestData,
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.message
        })
        // wx.request({
        //   url: 'https://wit.weichai.com/user/log',
        //   data: {
        //     log: JSON.stringify(res)
        //   },
        //   success: function(e){
        //     console.log(e)
        //   }
        // })
        var historyArray = [];
        // that.setData({
        //   historyLists: [],
        //   localPageindex: 1,
        //   // 当前请求数据的总页数
        //   localPageCount: 0,


        // })
        if (res.data.dataOption.dataCount !== '0') {
          for (var i = 0; i < res.data.dataOption.dataRows.length; i++) {
            // 时间戳(string)转换为日期格式:要将string转为整型   
            var startTime = util.formatTime(new Date(parseInt(res.data.dataOption.dataRows[i].startTime)))
            var endTime = util.formatTime(new Date(parseInt(res.data.dataOption.dataRows[i].endTime)))

            historyArray[i] = {
              startTime: startTime,
              endTime: endTime,
              sumHour: res.data.dataOption.dataRows[i].sumHour,
              sumMileage: res.data.dataOption.dataRows[i].sumMileage,
              // sumYH: res.data.dataOption.dataRows[i].sumYH,
              // hundredAverageConsume: res.data.dataOption.dataRows[i].hundredAverageConsume,
              trackId: res.data.dataOption.dataRows[i].id,
              url: '/pages/trackdetail/trackdetail'
            }
          }
          console.log(historyArray)
          that.setData({
            historyLists: historyArray,
            localPageCount: res.data.dataOption.pageCount
          })
        } else {
          wx.showToast({
            title: '当前时间段无历史轨迹信息',
            icon:'none'
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '数据异常',
          icon: 'none'
        })
      }
    })
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
    var that = this
    console.log('当前页码索引', this.data.localPageindex)
    that.setData({
      localPageindex: that.data.localPageindex + 1
    })

    if(this.data.localPageindex <= this.data.localPageCount){
      wx.showLoading({
        title: '加载中'
      })

      var start = that.data.startTime.replace(/-/g, '/')
      var end = that.data.endTime.replace(/-/g, '/')
      var user_startTime = Date.parse(new Date(start))
      var user_endTime = Date.parse(new Date(end))

      var that = this

      var requestData = {
        carID: this.data.carID,
        // time是long类型的时间戳
        startTime: user_startTime,
        endTime: user_endTime,
        queryType: 'weChat',
        pageIndex: that.data.localPageindex,
        pageCount: 10
      }

      wx.request({
        url: api.GetCarHistoryTrackByID,
        // data: {
        //   pageIndex: this.data.localPageindex,
        //   pageCount: 10,
        //   queryType: 'weChat'
        // },
        data: requestData,
        header: {
          token: wx.getStorageSync('token')
        },
        success: function(res){
          console.log(res)
          var historyArray =[];
          for (var i = 0; i < res.data.dataOption.dataRows.length; i++) {
            // 时间戳(string)转换为日期格式:要将string转为整型          
            var startTime = util.formatTime(new Date(parseInt(res.data.dataOption.dataRows[i].startTime)))
            var endTime = util.formatTime(new Date(parseInt(res.data.dataOption.dataRows[i].endTime)))
            historyArray[i] = {
              startTime: startTime,
              endTime: endTime,
              sumHour: res.data.dataOption.dataRows[i].sumHour,
              sumMileage: res.data.dataOption.dataRows[i].sumMileage,
              // sumYH: res.data.dataOption.dataRows[i].sumYH,
              // hundredAverageConsume: res.data.dataOption.dataRows[i].hundredAverageConsume,
              trackId: res.data.dataOption.dataRows[i].id,
              url: '/pages/trackdetail/trackdetail'
            }
          }
          that.setData({
            historyLists: that.data.historyLists.concat(historyArray),
            // localPageindex: that.data.localPageindex + 1
          })
          wx.hideLoading()
        },
        fail: function (err) {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '数据异常',
            icon: 'none' 
          })
        },
        // 请求完成
        complete: function (res) {}
      })

    } else {
      wx.showToast({
        title: '没数据啦/(ㄒoㄒ)/~~',
        icon: 'none',
        duration: 2000
      })
    }

  }

})