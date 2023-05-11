// page/component/popupModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    subject: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: '0%'
  },
  ready(){
    this.setData({
      height: '60%'
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose(){
      this.setData({
        height: '0%'
      })
      setTimeout(()=>{
        this.triggerEvent('close')
        this.triggerEvent('change')
      },300)
    }
  },

})
