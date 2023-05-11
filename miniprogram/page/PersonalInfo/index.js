const db = wx.cloud.database()
Page({

  data: {
    userData: {},
    userInfo: {},
    isEdit: false,
    submitting: false,
  },

  onLoad(options) {
    this.getUserInfo();
    this.init();
  },
  init() {
    db.collection('userInfo').get().then(res => {
      this.setData({
        userData: res.data[0]
      })
    })
  },
  getUserInfo() {
    db.collection('wxuserInfo').get().then(res => {
      this.setData({
        userInfo: res.data[0]
      })
    })
  },
  handleEdit() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  submit(event) {
    this.setData({
      submitting: true
    })
    if (this.data.userInfo?._id) {
      db.collection('wxuserInfo').doc(this.data.userInfo._id).update({
        data: {
          ...event.detail.value,
        }
      }).then(res => {
        this.setData({
          submitting: false,
        })
        if (!res.stats.updated) {
          wx.showToast({
            icon: 'error',
            title: '失败！',
          })
          return
        };
        this.setData({
          isEdit: false,
        })
        wx.showToast({
          icon: 'success',
          title: '更新成功',
        })
        this.getUserInfo()
      })
    } else {
      db.collection('wxuserInfo').add({
        data: {
          ...event.detail.value
        }
      }).then(res => {
        this.setData({
          submitting: false,
        })
        if (res.errMsg !== 'collection.add:ok') {
          wx.showToast({
            icon: 'error',
            title: '失败！',
          })
          return
        };
        this.setData({
          isEdit: false,
        })
        wx.showToast({
          icon: 'success',
          title: '添加成功',
        })
        this.userInfo()
      })
    }
  }
})