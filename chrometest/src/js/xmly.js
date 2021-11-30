
!function () {
  function saveData(data, callback) {
    console.log(data)
    setTimeout(() => {
      callback()
    }, 1000)
  }
  function getData(page = 1) {
    console.log(`正在抓取第【${page}】页数据`);
    let data = { currentPage: page, realId: '', pageSize: 10 }
    return $.ajax({
      url: 'https://hybrid.ximalaya.com/data/web/trackTotalData',
      type: 'get',
      data,
      xhrFields: {
        withCredentials: true
      },
    }).then((json) => {
      let data = json.data;
      saveData(data, function () {
        if (data.result && data.totalPage >= 10 && page <= 10) {
          getData(++page)
        } else {
          var myDate = new Date();
          myDate.toLocaleString();
          console.log("于" + myDate.toLocaleString() + "抓取完毕，1小时后将重新抓取");
          setTimeout(function () {
            getData()
          }, 3600000)
        }
      })
    }, (json) => {
      console.log(json)
      console.log(`第${page}页数据抓取失败`)
    })
  }
  getData()
}()