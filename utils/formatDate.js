function getNowFormatDate(day) {
  // var day = new Date();
  var Year = 0;
  var Month = 0;
  var Day = 0;
  var CurrentDate = "";
  Year = day.getFullYear();//支持IE和火狐浏览器.
  Month = day.getMonth() + 1;
  Day = day.getDate();
  CurrentDate += Year;
  if (Month >= 10) {
    CurrentDate += Month;
  }
  else {
    CurrentDate += "0" + Month;
  }
  if (Day >= 10) {
    CurrentDate += Day;
  }
  else {
    CurrentDate += "0" + Day;
  }
  return CurrentDate.toString();
}

function preDate(today,addDayCount){
  var dd=today
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + m + d;
}

module.exports={
  getNowFormatDate: getNowFormatDate,
  PreDate: preDate
}