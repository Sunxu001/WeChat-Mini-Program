import * as utils from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached() {
    // this.init();
    this.getDate();
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
    dateWeek: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDate: function () {
      let currentFirstDay = utils.getDate(this.data.newDate.year, this.data.newDate.month, 1);
      let date = currentFirstDay.getDay();
      // 当前开始天数
      let startDay = currentFirstDay - date * 60 * 60 * 1000 * 24
      let arr = [];
      for (let i = 0; i < 42; i++) {
        arr.push(new Date(startDay + i * 60 * 60 * 1000 * 24).getDate())
      }
      for(let i= arr.indexOf(1)-1;i>=0;i--){
        arr[i] = ''
      }
      arr = arr.slice(0,arr.lastIndexOf(1))
      this.setData({
        date: arr,
      })
    }
  }
})