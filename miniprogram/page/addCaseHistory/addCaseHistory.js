
const database = wx.cloud.database()
Page({

  data: {
    date: '',
    formData: {},
    submitting: false,
    imgUrl: []
  },

  onLoad(options) {
    console.log(options, 'ss');
    if (options._id) {
      this.setData({
        dataItem: options
      })
      this.init()
    }
  },

  init() {
    database.collection('medical-history-sheet').doc(this.data.dataItem._id).get().then(res => {
      if (res.errMsg !== "document.get:ok") return;
      this.setData({
        dataItem: res.data,
        imgUrl: res.data.imgUrl,
        date: res.data.date
      })
    })
  },

  handleSubmit(res) {
    const formData = res.detail.value
    for (let k in formData) {
      if (!formData[k]) {
        wx.showModal({
          title: '温馨提示',
          content: '表单内容不能为空',
          showCancel: false,
        })
        return
      }
    }

    this.setData({
      formData,
      submitting: true
    })
    if (this.data.dataItem?._id) {
      database.collection('medical-history-sheet').doc(this.data.dataItem._id).update({
        data: {
          ...this.data.formData,
          imgUrl: this.data.imgUrl,
        }
      }).then(res => {
        if (!res.stats) {
          wx.showToast({
            title: '失败',
          })
          return;
        }
        wx.showToast({
          title: '操作成功！',
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/page/caseHistory/caseHistory',
          })
        }, 500)
      })
    } else {
      database.collection('medical-history-sheet').add({
        data: {
          ...this.data.formData,
          imgUrl: this.data.imgUrl || []
        },
      }).then(res => {
        this.setData({
          submitting: false
        })
        if (res._id || res.errMsg == 'collection.add:ok') {
          wx.showToast({
            icon: 'success',
            title: '添加成功',
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/page/caseHistory/caseHistory',
            })
          }, 500)
        } else {
          wx.showToast({
            icon: 'error',
            title: '失败请稍后重试',
          })
        }
      })
    }
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  handleDeleteDate() {
    this.setData({
      date: ''
    })
  },
  handleUpload() {
    wx.chooseImage({
      success: chooseResult => {
        this.setData({
          submitting: true
        })
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: `${+new Date()}.png`,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            this.data.imgUrl.push(res.fileID)
            this.setData({
              imgUrl: this.data.imgUrl
            })
          },
          complete: () => {
            this.setData({
              submitting: false
            })
          }
        })
      },
    })
  }
})