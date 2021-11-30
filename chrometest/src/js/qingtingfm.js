!function () {
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
    console.log(arr)
    setTimeout(() => {
      callback()
    }, 1000)
  }
  if (cookies['user_id']) {
    getChannel()
  } else {
    console.log("请登录")
  }

}()