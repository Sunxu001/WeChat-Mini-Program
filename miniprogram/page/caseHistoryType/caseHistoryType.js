const Charts = require('../../utils/wxcharts-min')
const database = wx.cloud.database()
const _ = database.command
import * as utils from '../../utils/util'
Page({
  data: {
    submitting: false,
    meanValue: '',
    scopeDate: '',
    lowTension: 0,
    dataType: '',
    echartOptions: {
      title: '',
      date: ''
    },
    formData: {
      date: '',
      time: '',
      number: null,
      lowTension: null,
    },
    dateItem: false,
    dateCategories: {
      '日': ['0时', '6时', '12时', '18时'],
      '周': [],
      '月': [],
      '年': []
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
    type: {
      '心率': '次/分',
      '血压': "",
      '血糖': '毫摩尔/升',
      '胆固醇（血脂）': '次/分',
      '体重': '公斤',
    },
    dataSeries: []
  },

  onLoad(options) {
    this.setData({
      dataType: options?.name || '心率'
    })
    this.getData()
  },

  getData() {
    const {
      year,
      month,
      day
    } = utils.dateFormat(new Date())
    this.setData({
      echartOptions: {
        title: this.data.dataType,
        date: [year, month < 10 ? '0' + month : month, day < 10 ? '0' + day : day]
      },
      scopeDate: `${month}月${day}日`
    })
    let params = {}
    const dayValue = this.data.echartOptions
    if (this.data.activeDateName == '日') {
      const day = dayValue.date[2] < 10 ? '0' + dayValue.date[2] : String(dayValue.date[2])
      params = {
        day
      }
    } else if (this.data.activeDateName == '周') {
      const arr = []
      for (let i = 0; i < 7; i++) {
        const value = Number(dayValue.date[2]) - i
        arr.push(value < 10 ? '0' + value : String(value))
      }
      params = {
        day: _.in(arr)
      }
      this.data.dateCategories['周'] = arr
      this.setData({
        dateCategories: this.data.dateCategories,
        scopeDate: `${month}月${arr[0]}日-${month}月${arr[arr.length-1]}日`
      })
    } else if (this.data.activeDateName == '月') {
      const arr = []
      for (let i = 0; i < 6; i++) {
        const value = Number(dayValue.date[1]) - i <= 0 ? 12 : Number(dayValue.date[1]) - i;
        arr.push(value < 10 ? '0' + value : String(value))
      }
      params = {
        month: _.in(arr)
      }
      this.data.dateCategories['月'] = arr
      this.setData({
        dateCategories: this.data.dateCategories,
        scopeDate: `${arr[arr.length-1]}月-${arr[0]}月`
      })
    } else if (this.data.activeDateName == '年') {
      const arr = []
      for (let i = 0; i < 5; i++) {
        const value = Number(dayValue.date[0]) - i
        arr.push(String(value))
      }
      params = {
        year: _.in(arr)
      }
      this.data.dateCategories['年'] = arr
      this.setData({
        dateCategories: this.data.dateCategories,
        scopeDate: `${arr[0]}年-${arr[arr.length - 1]}年`
      })
    }
    database.collection('personage-data').orderBy('date', 'desc').where({
      type: this.data.dataType,
      ...params
    }).get().then(res => {
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

      let arr = []
      let arr2 = []
      const echartsName = this.data.activeDateName
      this.data.dateCategories[this.data.activeDateName].forEach(v => {
        arr.push(0)
        arr2.push(0)
      })
      const unit = this.data.type[this.data.dataType]
      const dataList = res.data.sort()
      if (echartsName == '日') {
        res.data.forEach(v => {
          const day = Number(v.time.split(':')[0])
          if (day >= 0 && day < 6) {
            arr[0] += Number(v.number)
            arr2[0] += Number(v.lowTension)
          } else if (day >= 6 && day < 12) {
            arr[1] += Number(v.number)
            arr2[1] += Number(v.lowTension)
          } else if (day >= 12 && day < 18) {
            arr[2] += Number(v.number)
            arr2[2] += Number(v.lowTension)
          } else if (day >= 18 && day < 24) {
            arr[3] += Number(v.number)
            arr2[3] += Number(v.lowTension)
          }
        })
      } else if (echartsName == '周') {
        res.data.forEach(v => {
          arr[this.data.dateCategories['周'].indexOf(v.day)] += Number(v.number)
          arr2[this.data.dateCategories['周'].indexOf(v.day)] += Number(v.lowTension)
        })
      } else if (echartsName == '月') {
        res.data.forEach(v => {
          arr[this.data.dateCategories['月'].indexOf(v.month)] += Number(v.number)
          arr2[this.data.dateCategories['月'].indexOf(v.month)] += Number(v.lowTension)
        })
      } else if (echartsName == '年') {
        res.data.forEach(v => {
          arr[this.data.dateCategories['年'].indexOf(v.year)] += Number(v.number)
          arr2[this.data.dateCategories['年'].indexOf(v.year)] += Number(v.lowTension)
        })
      }
      const seriesData = [{
        name: this.data.dataType,
        data: arr
      }]
      let meanValue = 0 + unit
      if(dataList.length){
        meanValue = dataList.length > 1 ? `${dataList[dataList.length-1]?.number}-${dataList[0]?.number} ${unit}` : `${dataList[0]?.number}${unit}`
      }
      if (this.data.dataType == '血压') {
        let lowValue = dataList.length > 1 ? `${dataList[dataList.length-1]?.lowTension}-${dataList[0]?.lowTension} ${unit}` :  `${dataList[0]?.lowTension} ${unit}`;
        this.setData({
          lowTension: lowValue
        })
        seriesData[0].name = '高压'
        const obj = {
          name: '低压',
          data: arr2
        }
        seriesData.push(obj)
      }

      this.setData({
        meanValue,
        dataSeries: seriesData,
      })
      this.init()
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
      height: 225
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
    if (this.data.activeDateName == activeName) {
      return;
    }
    this.setData({
      activeDateName: activeName
    })
    this.getData()
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
    } else if (this.data.dataType == '血压' && !this.data.formData.number && !this.data.formData.lowTension) {
      wx.showToast({
        icon: 'error',
        title: '高低压不能为空',
      })
      return;
    } else if ((this.data.dataType == '胆固醇（血脂）' || this.data.dataType == '血糖') && !this.data.formData.number) {
      wx.showToast({
        icon: 'error',
        title: '毫摩尔不能为空',
      })
      return;
    } else if (this.data.dataType == '体重' && !this.data.formData.number) {
      wx.showToast({
        icon: 'error',
        title: '公斤不能为空',
      })
      return;
    }
    this.setData({
      submitting: true
    })
    const [year, month, day] = this.data.formData.date.split('-')
    database.collection('personage-data').add({
      data: {
        ...this.data.formData,
        type: this.data.dataType,
        year,
        month,
        day
      }
    }).then(res => {
      this.setData({
        submitting: false
      })
      if (res._id || res.errMsg == 'collection.add:ok') {
        wx.showToast({
          icon: 'success',
          title: '添加成功',
        })

        this.setData({
          formData: {
            date: '',
            time: '',
            number: null,
            lowTension: null,
          },
        })
        this.close();

        this.getData();
      } else {
        wx.showToast({
          icon: 'error',
          title: '失败请稍后重试',
        })
      }
    })
  },
})