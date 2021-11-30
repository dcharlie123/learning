
window.onload = function () {
  document.querySelector("#btn_xmly").onclick = function () {
    $.ajax({
      url: 'https://hybrid.ximalaya.com/data/pcindex/voice',
      type: 'get',
      xhrFields: {
        withCredentials: true
      },
    })
      .done(function (json) {
        window.open("https://hybrid.ximalaya.com/data/pcindex/voice")
      })
      .fail(function (json) {
        if (json.status === 401) {
          window.open("https://passport.ximalaya.com/page/web/login?fromUri=https%3A%2F%2Fhybrid.ximalaya.com%2Fdata%2Fpcindex%2Fvoice")
        }
      })
  }
  document.querySelector("#btn_qt").onclick =function() {
    window.open("https://admin.qingting.fm/")
  }
}