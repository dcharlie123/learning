const express = require("express");
const axios = require('axios');
const cron = require("node-cron");
const  app=express()
// app.get("/xlmy",reqXLMY)
cron.schedule("*/1 * * * * *", function() {
  reqXLMY()
});
app.listen(3128)
// async function reqXLMY(){
//   try {
//     let res=await axios({
//       method: 'get',
//       url: 'https://hybrid.ximalaya.com/data/web/trackTotalData',
//       data: {
//         currentPage: 1,
//         realId: '',
//         pageSize:10
//       },
//       headers:{Cookie:"1&_token=164327102&9CAB0530240NCA48B34AFE5AA86A8DC5126AD8D1C8D6835AA58F495D0E5866282ACCE3DB3B6938MAF6A0B136189BCB_"}
//     });
//     console.log(res)
//   } catch (error) {
//     return error
//   }
// }