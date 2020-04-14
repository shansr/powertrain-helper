// pages/statistic/statistic.js
import * as echarts from '../../ec-canvas/echarts'
var api = require('../../config/api.js');
var thisChart
var thisApp

function initChart(canvas, width, height) {
  var that = this
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart)
  thisChart = chart
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: api.GetStatisticDataByVin,
    data: {
      vin: thisApp.data.vin,
      type: 1
    },
    header: {
      token: wx.getStorageSync('token')
    },
    success: function (e) {
      wx.hideLoading()
      console.log(e)
      var time = []
      var runMileage = []
      var allRunMileage = []
      var rqqxhl = []
      var zqh = []
      // var 
      let j = e.data.dataOption.length > 10 ? e.data.dataOption.length - 10 : 0
      for (let i = j; i < e.data.dataOption.length; i++) {
        var item = e.data.dataOption[i]
        time.push(item.dateVal)
        runMileage.push(item.runMileage)
        allRunMileage.push(item.allRunMileage)
        var rqqxhl_value = item.rqqxhl == null ? 0 : item.rqqxhl
        var runMileage_value = item.runMileage
        var rqqxhl_per_day = runMileage_value == 0 ? 0 : rqqxhl_value / runMileage_value * 100
        var rqqxhl_per_day_t = (item.qhljz / item.allRunMileage) * 100
        rqqxhl.push(rqqxhl_per_day.toFixed(2))
        // rqqxhl.push(rqqxhl_per_day_t.toFixed(2))
        zqh.push(item.qhljz == null ? 0 : item.qhljz)
      }
      var option1 = createOption('里程', time, '日里程\n(km)', runMileage, '总里程\n(km)', allRunMileage)
      var option2 = createOption('氢耗', time, '日氢耗\n(kg/100km)', rqqxhl, '总氢耗\n(kg)', zqh)
      thisApp.setData({
        option1: option1,
        option2: option2
      })
      // var option1 = createOption('里程',)
      thisChart.setOption(option1, true)
      console.log(e)
    },
    fail: function (e) {
      console.log(e)
      wx.hideLoading()
    }
  })
  return chart
}


function createOption(name, time, name1, value1, name2, value2) {
  var option = {
    title: {
      text: name,
      left: 'center'
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      position: function (point, params, dom, rect, size) {
        // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
        // 提示框位置
        var x = 0 // x坐标位置

        // 当前鼠标位置
        var pointX = point[0]
        // 外层div大小
        var viewWidth = size.viewSize[0]

        // 提示框大小
        var boxWidth = size.contentSize[0]
        if (boxWidth > pointX) {
          x = 5;
        } else { // 左边放的下
          x = pointX - boxWidth
        }
        return [x, point[1]]
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: time,
      axisLabel: {
        rotate: 60,
        interval: 0,
        textStyle: {
          fontSize: 14
        }
      },
    }],
    yAxis: [{
      type: 'value',
      name: name1,
      position: 'left',
      // scale: true,
      axisLabel: {
        interval: 0,
        textStyle: {
          fontSize: 12
        }
      }
    }, {
      type: 'value',
      name: name2,
      position: 'right',
      scale: true,
      axisLabel: {
        interval: 0,
        textStyle: {
          fontSize: 12
        }
      }
    }],
    series: [{
      type: 'bar',
      name: name1,
      data: value1
    },
    {
      itemStyle: {
        normal: {
          color: '#ee0000',
          lineStyle: {
            color: '#ee0000'
          }
        }
      },
      type: 'line',
      name: name2,
      yAxisIndex: 1,
      data: value2
    }
    ]
  }
  return option
}




Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    // imageWidth: 0,
    current: 'time',
    startTime: "",
    endTime: "",
    chartData: [],
    startTimeStamp: 0,
    endTimeStamp: 0,
    carNumber: '',
    vin: '',
    carId: '',
    option1: {},
    option2: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      current: 'distance'
    })
    thisApp = this

    // console.log
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.YtotalValue)
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
  handleChange: function (e) {
    this.setData({
      current: e.detail.key
    })
    if (e.detail.key == 'distance') {
      thisChart.setOption(this.data.option1)
    }
    if (e.detail.key == 'consumption') {
      thisChart.setOption(this.data.option2)
    }
  }
})