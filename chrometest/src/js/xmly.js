
!function () {
  let key = "7a05a9c4054ca0f7e0a8527f07be95ef";
  let replayCount = 0, TIME = 3;
  function saveData(arr, callback) {
    let data = arr.result.map((item) => {
      return {
        playCount: item.playCount,
        title: item.title,
        finishRate: item.finishRate,
        commentCount: item.commentCount
      }
    })
    let postData = { from: '喜马拉雅', data };
    let sign = SparkMD5.hash(`${JSON.stringify(postData)}|${key}`).slice(16)
    $.ajax({
      url: `https://ndapp.nandu.com/server.php?m=AudioFeedbackReceiver&a=stats&sign=${sign}`,
      type: 'post',
      contentType: "application/json",
      dataType: "text",
      data: JSON.stringify(postData)
    })
      .done(function (json) {
        console.log(json)
        console.log("数据上传成功")
        callback()
      })
      .fail(function () {
        if (replayCount < TIME) {
          replayCount++
          console.log(`正在尝试第${replayCount}次数据上传`)
          saveData(arr, callback)
        } else {
          replayCount = 0;
          console.log("数据上传失败")
          callback()
        }
      })
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
        if (data.result && data.totalPage >= 10 && page < 10) {
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