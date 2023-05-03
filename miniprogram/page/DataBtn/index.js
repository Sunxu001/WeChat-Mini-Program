// page/记录健康数据/index.js 
Page({

  /** 
   * 页面的初始数据 
   */
  data: {

  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad(options) {

  },
  handleToAdd: function (e) {
    const {
      item
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/page/caseHistoryType/caseHistoryType?name=${item}`,
    })
  }
})