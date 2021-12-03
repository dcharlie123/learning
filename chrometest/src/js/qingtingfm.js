!function () {
  let key = "7a05a9c4054ca0f7e0a8527f07be95ef";
  let replayCount = 0, TIME = 3;
  function getCookie(name) {
    let cookies = {};
    document.cookie.split(';').forEach(item => {
      let data = item.split('=')
      cookies[data[0].trim()] = data[1]
    })
    if (name) {
      return cookies[name]
    }

    return cookies
  }
  let cookies = getCookie();
  function getChannel() {
    let data = { filter: { "status": 99 }, device_type: 'unknown', client_type: 'pod_web', wv: 'unknown', user_id: cookies['user_id'], device_id: 'ea35d751-327d-45a7-a3e5-31f68feb14d6', user_token: cookies['zhibo_user_token'], ut: 1 }
    $.ajax({
      url: `https://papi.qingting.fm/papi/podcasters/${cookies['user_id']}/channels`,
      type: 'get',
      data,
      xhrFields: {
        withCredentials: true
      },
    })
      .done((res) => {
        getData(res.data)
      })
      .fail((res) => {

        console.log('专辑数据抓取失败')
      })
  }
  function getData(arr, index = 0) {
    console.log(`正在抓取【${arr[index].title}】专辑数据`)
    let data = {
      order: "program_id%20desc",
      device_type: "unknown",
      client_type: "pod_web",
      wv: "unknown",
      pt: "channel_data",
      user_id: cookies['user_id'],
      device_id: "ea35d751-327d-45a7-a3e5-31f68feb14d6",
      user_token: cookies['zhibo_user_token'],
      ut: 1,
      pagesize: 100
    }
    $.ajax({
      url: `https://papi.qingting.fm/papi/v2/rpt/channels/${arr[index].id}/programs`,
      type: 'get',
      data,
      xhrFields: {
        withCredentials: true
      },
    })
      .done((res) => {
        saveData(res, function () {
          if (index < (arr.length - 1)) {
            getData(arr, ++index)
          } else {
            var myDate = new Date();
            myDate.toLocaleString();
            console.log("于" + myDate.toLocaleString() + "抓取完毕，1小时后将重新抓取");
            setTimeout(function () {
              getChannel()
            }, 3600000)
          }
        })
      })
      .fail((res) => {
        console.log(`【${arr[index].title}】专辑数据抓取失败`)
      })
  }
  function saveData(arr, callback) {
    let data = arr.data.items.map(item => {
      return {
        playCount: item.play,
        title: item.title,
        finishRate: item.completion,
        commentCount: item.comment
      }
    })
    let postData = { from: '蜻蜓FM', data };
    let sign = SparkMD5.hash(`${JSON.stringify(postData)}|${key}`).slice(16)
    $.ajax({
      url: `https://ndapp.test.oeeee.com/server.php?m=AudioFeedbackReceiver&a=stats&sign=${sign}`,
      type: 'post',
      contentType: "application/json", //必须这样写
      dataType: "text",
      data: JSON.stringify(postData)
    })
      .done(function (json) {
        console.log(json)
        console.log("数据上传成功")
        callback()
      })
      .fail(function (json) {
        console.log(json)
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
  if (cookies['user_id']) {
    getChannel()
  } else {
    console.log("请登录")
  }

}()