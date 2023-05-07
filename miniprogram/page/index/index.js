const database = wx.cloud.database()
Page({
  data: {
    //轮播图
    movies: [{
        url: '../../image/Carousel-blue.png'
      },
      {
        url: '../../image/Carousel-green.png'
      },
      {
        url: '../../image/Carousel-pink.png'
      },
    ],
    date: []
  },
  onLoad(options) {
    this.init()
  },
  init() {
    database.collection('medical-history-sheet').get().then(res => {
      if (res.errMsg !== "collection.get:ok") {
        wx.showModal({
          title: '温馨提示',
          content: '数据拉取失败，点击确定重试',
          complete: (res) => {
            if (res.confirm) {
              this.init()
            }
          }
        })
        return
      }
      this.setData({
        date: res.data.map(v => v.date)
      })
    })
  },
  handleToAdd: function () {
    wx.navigateTo({
      url: '/page/addCaseHistory/addCaseHistory'
    })
  },
  handleToData: function () {
    wx.navigateTo({
      url: '/page/DataBtn/index'
    })
  }
})