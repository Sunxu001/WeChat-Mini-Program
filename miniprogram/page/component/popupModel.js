// page/component/popupModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    height: '0%'
  },
  attached(){
    this.setData({
      height: '60%'
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose:function(){
      this.setData({
        height: '0%'
      })
      setTimeout(()=>{
        this.triggerEvent('close')
      },500)
    }
  },

})
