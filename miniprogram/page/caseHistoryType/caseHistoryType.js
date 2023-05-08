const Charts = require('../../utils/wxcharts-min')
const database = wx.cloud.database()
Page({

  data: {
    dataType: '',
    formData: {
      date: '',
      time: '',
      number: null,
      high: null,
      lowTension: null,
      liter: null,
      kg: null,
    },
    dateItem: false,
    dateCategories: {
      '日': ['0时', '6时', '12时', '18时'],
      '周': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      '月': ['月初', '月中', '月末'],
      '年': ['0时', '6时', '12时', '18时']
    },
    dateName: ['日', '周', '月', '年'],
    activeDateName: '日',
    subject: {
      '心率': '#b6e1ff',
      '血压': "#ffbcd4",
      '血糖': '#fac99d',
      '胆固醇（血脂）': '#fae69e',
      '体重': '#bdebf0',
    },
    dataSeries: [{
      name: '心率',
      data: [15, 30, 50, 60]
    }]
  },

  onLoad(options) {
    this.setData({
      dataType: options?.name || '心率'
    })
    this.getData()
    this.init();
  },

  getData(){
    database.collection('personage-data').get().then(res=>{
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
      console.log(res.data);
    })
  },

  init() {
    new Charts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: this.data.dateCategories[this.data.activeDateName],
      series: this.data.dataSeries,
      yAxis: {
        min: 0
      },
      width: 350,
      height: 200
    });
  },

  handleAdd() {
    this.setData({
      dateItem: true
    })
  },

  close() {
    this.setData({
      dateItem: false
    })
  },

  handleCutDate(event) {
    const activeName = event.currentTarget.dataset.name
    this.setData({
      activeDateName: activeName
    })
    this.init()
  },

  handleChange(e) {
    const name = `formData.${e.currentTarget.dataset.name}`
    this.setData({
      [name]: e.detail.value
    })
  },

  handleSubmit(e) {
    if (!this.data.formData.date || !this.data.formData.time) {
      wx.showToast({
        icon: 'error',
        title: '请选择时间日期',
      })
      return
    }
    this.setData({
      formData: {
        ...e.detail.value,
        date: this.data.formData.date,
        time: this.data.formData.time,
      }
    })
    this.submit()
  },

  submit() {
    if (this.data.dataType == '心率' && !this.data.formData.number) {
      wx.showToast({
        icon: 'error',
        title: '次/分不能为空',
      })
      return;
    } else if (this.data.dataType == '血压' && !this.data.formData.high && !this.data.formData.lowTension) {
      wx.showToast({
        icon: 'error',
        title: '高低压不能为空',
      })
      return;
    } else if ((this.data.dataType == '胆固醇（血脂）' || this.data.dataType == '血糖') && !this.data.formData.liter) {
      wx.showToast({
        icon: 'error',
        title: '毫摩尔不能为空',
      })
      return;
    } else if (this.data.dataType == '体重' && !this.data.formData.kg) {
      wx.showToast({
        icon: 'error',
        title: '公斤不能为空',
      })
      return;
    }
    console.log(this.data.formData, 'submit');
    database.collection('personage-data').add({
      data: {
        ...this.data.formData
      }
    }).then(res => {
      if (res._id || res.errMsg == 'collection.add:ok') {
        wx.showToast({
          icon: 'success',
          title: '添加成功',
        })
        this.close();
        this.init();
      } else {
        wx.showToast({
          icon: 'error',
          title: '失败请稍后重试',
        })
      }
    })
  }

})