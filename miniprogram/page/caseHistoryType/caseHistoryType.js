// page/caseHistoryType/caseHistoryType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateItem: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handleAdd: function () {
    this.setData({
      dateItem: true
    })
  },
  close: function () {
    console.log('关闭')
    this.setData({
      dateItem: false
    })
  }

})