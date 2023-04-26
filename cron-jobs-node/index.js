const express = require("express");
const axios = require('axios');
const cron = require("node-cron");
const qs = require('qs')
const app = express()
function PrefixZero(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}
function reqXLMY(time) {
var min=Math.floor(time%3600);
let hms=PrefixZero(Math.floor(time/3600),2) + ":" + PrefixZero(Math.floor(min/60),2) + ":"+ PrefixZero(time%60,2);
  let data = {
    "labelId": "wlxy",
    "courseId": '40254d9724b84897b3e7e6c55403c48e',
    "callbackId": '',
    "event": 'beat',
    "scoData": `{ "cmi.core.lesson_location": "${time}", "cmi.core.session_time": "${hms}" }`
  }
  console.log(data);
  axios({
    method: 'post',
    url: 'https://appd.shawcoder.xyz/resplay/resCoursse/heartbeat',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuaWQiOiJ3bHh5Iiwicm9sZWlkIjoiMTAwMCIsImV4cCI6MTYzOTYyNjAyMSwidXNlcmlkIjoiMTc5NTg4YzRlOTlkNDAyMGJlNjg0NTczMDM4ZmJmY2QiLCJyZW1vdGVBZGRyIjoiIn0.buFIXoJylPVJPQde0uEQziDTUiHVHPVNBdtW10XUF-s" }
  }).then(res => { console.log(res.data) }, (err) => { console.log('err') })
}
app.use('/',function(){
  let i=0;
  let timer=setInterval(()=>{
    
    
    if(i<=10000){
      reqXLMY(i)
      i+=30;
    }else{
clearInterval(timer)
    }
  },1000*30)
})
app.listen(9090)