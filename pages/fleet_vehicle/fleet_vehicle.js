// pages/fleet_vehicle/fleet_vehicle.js
var api = require('../../config/api.js');
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId:'',
    vehicles:[],
    allVehicles: [],
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log(options)
    this.setData({
      groupId: options.groupId
    })
    this.loadData()
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
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  loadData:function(){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: api.GetFleetVehicle,
      header: {
        token: wx.getStorageSync("token")
      },
      data: {
        groupId: that.data.groupId
      }, success: function (e) {
        wx.hideLoading()
        console.log(e)
        wx.stopPullDownRefresh()
        var vehs = []
         var sum = 0
         var sumzqh = 0
        for (let i = 0; i < e.data.dataOption.length; i++) {
          var it = e.data.dataOption[i]
          // console.log(it)
          var item = {
            plateCode: it.plateCode,
            vin: it.vin,
            carId: it.carId,
            plateCode: it.plateCode,
            status: it.status,
            allMileage: it.allMileage,
            zqh: it.zqh.toFixed(1)
          }
          sum += it.allMileage
          sumzqh += it.zqh
          vehs.push(item)
        }
        console.log('total mil:'+ sum)
        console.log('total zqh:' + sumzqh)

        vehs.sort(that.compare("status"))

        that.setData({
          vehicles: vehs,
          allVehicles: vehs
        })
        //console.log(that.data.vehicles)
        // console.log('allZqh' + sum)
      }, fail: function (e) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        console.log(e)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  inputChange(e){
    var that = this
    this.setData({
      searchValue: e.detail.value
    })
    if(e.detail.value.length == 0){
      this.setData({
        vehicles: that.data.allVehicles
      })
    } else {
      let filters = this.data.allVehicles.filter((item)=>{
        return item.plateCode.toUpperCase().indexOf(e.detail.value.toUpperCase()) >= 0
      })
      this.setData({
        vehicles: filters
      })
    }
    
    //console.log(filters)

    // var that = this
    // wx.request({
    //   url: api.GetCarList,
    //   data: {
    //     pageIndex: 1,
    //     pageCount: 10,
    //     queryType: "weChat",
    //     searchText: e.detail.value
    //   },
    //   header: {
    //     token: wx.getStorageSync("token")
    //   },
    //   success: function (e) {

    //   }
    // })
  },
  functionItemClick(e) {
    console.log(e)
    wx.navigateTo({
      // url: '/pages/home/home?groupId=' + e.currentTarget.dataset.groupid,
      url: '/pages/vehicle/vehicle?carId=' + e.currentTarget.dataset.data.carId + '&carNumber=' + e.currentTarget.dataset.data.plateCode + '&vin=' + e.currentTarget.dataset.data.vin
    })
  },
  compare: function (property) {

    return function (a, b) {
      var value1 = a[property]
      var value2 = b[property]
      return value2 - value1
    }
  }
})