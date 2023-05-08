const database = wx.cloud.database()
Page({

  data: {
    date: '',
    imgUrl: []
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
      formData
    })

    database.collection('medical-history-sheet').add({
      data: {
        ...this.data.formData,
        imgUrl: this.data.imgUrl || []
      },
    }).then(res => {
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
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: `${+new Date()}.png`,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log(res,'res');
            this.data.imgUrl.push(res.fileID)
            this.setData({
              imgUrl: this.data.imgUrl
            })
            console.log(this.data.imgUrl,'url');
          },
        })
      },
    })
  }
})