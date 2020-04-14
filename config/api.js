const urlPath ="https://gpsapp.weichai.com:8443/";
// const urlPath="https://gps-test.weichai.com:8443/";
const urlPath1 ="https://wit.weichai.com/";
module.exports={
  AuthLogin: urlPath1 +'wxAuth/getAuthInfo',//获取code
  AuthUserInfo: urlPath1 + 'wxAuth/decrypt', //微信登录
  Login: urlPath + 'api/auth/login',//用户登录
  GetCarList:urlPath+'api/app/v1/vehicle/list',//分页获取车辆列表
  GetCarDetailByID: urlPath + 'api/app/v1/vehicle/detail',//获取车辆整机详情
  GetMonitorInfoByVin: urlPath + 'api/app/v1/vehicle/monitors',//获取单车监控信息
  GetCarHistoryTrackByID: urlPath + '/api/app/v1/vehicle/history/track',//分页获取车辆历史轨迹信息
  GetTrackDetailByID: urlPath + '/api/app/v1/vehicle/history/track-detail',//获取某次历史轨迹详情
  GetStatisticData:urlPath+'api/app/v1/vehicle/statistics',//统计功能
  GetStatisticDataByVin:urlPath +'api/app/v1/vehicle/new/statistics',//获取单车统计数据
  GetFleet:urlPath + 'api/app/v1/vehicle/group/app/statistics', //获取分组信息
  GetFleetVehicle: urlPath + 'api/app/v1/vehicle/group/statistics',//获取分组车的信息
  GetDtcInfo:urlPath+'api/app/v1/fault/statistics'//获取故障统计信息
}