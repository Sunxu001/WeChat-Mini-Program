const database = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    select: false
  },

  onLoad(options) {
    this.init()
  },
  init() {
    database.collection('medical-history-sheet').get().then(res => {
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
      res.data.forEach(v => {
        v.select = false
      })
      this.setData({
        list: res.data
      })
    })
  },
  handleEdit() {
    this.setData({
      select: true
    })
  },
  handleCancel() {
    this.setData({
      select: false
    })
  },

  handleSelect(e) {
    const item = e.currentTarget.dataset.item
    this.data.list.forEach(v => {
      if (v._id == item._id) {
        v.select = !v.select
      }
    })
    this.setData({
      list: this.data.list
    })
  },
  handleDelete() {
    const arr = this.data.list.filter(v => v.select).map(v => v._id)
    if (!arr.length) {
      wx.showToast({
        title: '请选择数据',
      })
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '是否确认删除已选择数据',
      complete: (res) => {
        if (res.confirm) {
          try {
            arr.forEach(v => {
              database.collection('medical-history-sheet').where({
                _id: v
              }).remove().then(res => {
                if (res.errMsg == 'collection.remove:ok') {
                  wx.showToast({
                    title: '操作成功',
                  })
                  this.init()
                  this.setData({
                    select: false
                  })
                } else {
                  wx.showToast({
                    title: '操作失败',
                  })
                }
              })
            })
          } catch (e) {
            console.log(e);
          }
        }
      }
    })

  },
  onPullDownRefresh() {
    this.init()
  }
})