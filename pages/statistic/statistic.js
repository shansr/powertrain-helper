// pages/statistic/statistic.js
import * as echarts from '../../ec-canvas/echarts'
var api = require('../../config/api.js');
var thisChart


function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart)
  thisChart = chart
   var option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    legend: {
        data: ['降水量', '平均温度']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    series: [   
        {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]
        },
        {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3 ]
        }
    ]
};
chart.setOption(option);
  return chart
}
function createOption(name, data) {
  console.log(data)
  var timeStampData = []
  var i
  for(i = 0 ; i < data.values[0].length;i++){
    var item = []
    var year = data.values[0][i].substring(0,4)
    var mouth = data.values[0][i].substring(4, 6)
    var day = data.values[0][i].substring(6, 8)
    var timpTmp = year + '/' + mouth + '/' + day + " 00:00:00"
    item[0] = new Date(timpTmp).getTime()
    item[1] = data.values[1][i]
    timeStampData.push(item)
  }
  console.log(timeStampData)
  var option = {
    title: {
      text: name,
      left: 'center'
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
    xAxis: [
      {
        type: 'time',
        // data: data.values[0],
        // data: timeStampData,c
        axisTick: {
          alignWithLabel: true
        },
       
        axisLabel: {
          rotate: 60,
          interval: 0,
          textStyle: {
            fontSize: 14
          },
          formatter: function (e) {
            // console.log(e)
            return formatTimeTwo(e,'M/D')
          }
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          interval: 0,
          textStyle: {
            fontSize: 12
          }
        }
      }
    ],
    series: [
      {
        // name: data.keys[1],
        type: 'bar',
        barWidth: '50%',
        // data: data.values[1]
        data: timeStampData
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
    current:'time',
    startTime: "",
    endTime: "",
    chartData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(this.data.YtotalValue)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  handleChange: function(e) {
    this.setData({
      current: e.detail.key
    })
    var that = this
    const name = []
    if (that.data.current == "time"){
      var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
     
        legend: {
            data: [ '降水量', '平均温度']
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水量',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: '温度',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name: '降水量',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6]
            },
            {
                name: '平均温度',
                type: 'line',
                yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]
            }
        ]
    };
    
      thisChart.setOption(option, true)
    }
    if(that.data.current == "distance"){
      var option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };
    thisChart.setOption(option, true)
    }
    if (that.data.current == "consumption") {
      // wx.request({
      //   url: api.GetStatisticData,
      //   method: 'get',
      //   data: {
      //     carIds: that.data.carId,
      //     statisticType1: 'day',
      //     statisticType2: 'totalConsume',
      //     startTime: that.data.startTime,
      //     endTime: that.data.endTime
      //   },
      //   header: {
      //     token: wx.getStorageSync('token')
      //   },
      //   success: function (res) {
      //     console.log(res.data.dataOption)
      //     name.push(res.data.dataOption[0].data)
      //     console.log(res.data.dataOption[0].data)
      //     var time = []
      //     var value = []
      //     for (let j = 0; j < res.data.dataOption[0].data.length; j++) {
      //       // console.log(res.data.dataOption[0].data[j].time)
      //       time.push(res.data.dataOption[0].data[j].time)
      //       value.push(res.data.dataOption[0].data[j].value)
      //     }
      //     var optionData = {}
      //     optionData.values = []
      //     optionData.keys = []
      //     optionData.keys.push('时间')
      //     optionData.keys.push('运行时间')
      //     optionData.values.push(time)
      //     optionData.values.push(value)
      //     console.log(optionData)
      //     var option = createOption('能耗(公斤/百公里)', optionData)
      //     thisChart.setOption(option, true)
      //   }
      // })
    }
  }
})