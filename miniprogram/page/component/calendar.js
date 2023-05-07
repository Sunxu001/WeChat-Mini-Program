import * as utils from '../../utils/util'
Component({
  properties: {
    selectDate: {
      type: Array,
      value: []
    }
  },
  attached() {
    this.getDate();
    this.init();
  },

  /**
   * 组件的初始数据
   */
  data: {
    week: ['Sun', "Mon", 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    date: [],
    newDate: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      week: new Date().getDate()
    },
    dateWeek: null,
    day: []
  },
  methods: {
    init() {
      const arr = this.data.selectDate.map(v => {
        let date_str = v.split('-')
        if (Number(date_str[0]) == this.data.newDate?.year && Number(date_str[1] - 1 == this.data.newDate?.month)) {
          return Number(date_str[2])
        }
      })
      this.setData({
        day: arr
      })
    },

    getDate: function () {
      let currentFirstDay = utils.getDate(this.data.newDate.year, this.data.newDate.month, 1);
      let date = currentFirstDay.getDay();
      // 当前开始天数
      let startDay = currentFirstDay - date * 60 * 60 * 1000 * 24
      let arr = [];
      for (let i = 0; i < 42; i++) {
        arr.push(new Date(startDay + i * 60 * 60 * 1000 * 24).getDate())
      }
      for (let i = arr.indexOf(1) - 1; i >= 0; i--) {
        arr[i] = ''
      }
      arr = arr.slice(0, arr.lastIndexOf(1))
      this.setData({
        date: arr,
      })
    },
    handleIncrease() {
      this.setData({
        newDate: {
          ...this.data.newDate,
          month: this.data.newDate.month + 1 > this.data.monthName.length - 1 ? 0 : this.data.newDate.month + 1
        }
      })
      this.getDate();
      this.init();
    },
    handleReduce() {
      this.setData({
        newDate: {
          ...this.data.newDate,
          month: this.data.newDate.month - 1 < 0 ? 11 : this.data.newDate.month - 1
        }
      })
      this.getDate();
      this.init();
    },
  },
  observers: {
    'selectDate': function () {
      this.init()
    }
  }
})