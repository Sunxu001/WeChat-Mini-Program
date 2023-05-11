const database = wx.cloud.database()
Page({
  onShareAppMessage() {
    return {
      title: '我的病历本-我',
      path: 'page/API/index'
    }
  },

  data: {
    isSetTabBarPage: false,
    theme: 'light',
    userInfo: {}
  },
  onLoad() {
    this.init()
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({
        theme
      }) => {
        this.setData({
          theme
        })
      })
    }
  },
  init(){
    database.collection('userInfo').get().then(res => {
      this.setData({
        userData: res.data[0]
      })
    })
  },
  onShow() {
    this.leaveSetTabBarPage()
  },
  onHide() {
    this.leaveSetTabBarPage()
  },
  kindToggle(e) {
    const id = e.currentTarget.id;
    const
      list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        if (list[i].url) {
          wx.navigateTo({
            url: `../../packageAPI/pages/${list[i].id}/${list[i].url}`
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },
  enterSetTabBarPage() {
    this.setData({
      isSetTabBarPage: true
    })
  },
  leaveSetTabBarPage() {
    this.setData({
      isSetTabBarPage: false
    })
  },
  handleToAdd: function () {
    wx.navigateTo({
      url: '/page/PersonalInfo/index'
    })
  },
  handleLogin() {
    wx.getUserProfile({
      desc: '登录',
      success: res => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl
        })
        console.log(res, 'res');
        database.collection('userInfo').add({
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
          }
        }).then(res=>{
          wx.showToast({
            icon: 'success',
            title: '登录成功',
          })
        })
      }
    })
  }
})