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
  },
  handleToAdd: function () {
    console.log(111);
    wx.navigateTo({
      url: '/page/addCaseHistory/addCaseHistory'
    })
  }
})