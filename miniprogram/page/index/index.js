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
    wx.navigateTo({
      url: '/page/addCaseHistory/addCaseHistory'
    })
  },handleToData:function(){
    wx.navigateTo({
      url: '/page/DataBtn/index'
    })
  }
})