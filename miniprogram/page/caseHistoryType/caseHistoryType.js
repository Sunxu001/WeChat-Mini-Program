const Charts = require('../../utils/wxcharts-min')



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

    new Charts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['0时', '6时', '12时', '18时'],
      series: [{
        name: '心率1',
        data: [15,30,50,60]
      }, {
        name: '心率2',
        data: [40, 30,25,20],
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 350,
      height: 200
    });
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