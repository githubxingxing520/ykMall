// pages/category/index.js
import { request } from './../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], //左侧菜单数据
    rightContentList: [], //右侧数据
    currentIndex: 0, //当前选中的menu项
    scrollTop:0
  },
  cateList: [], //分类所有数据
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let cates = wx.getStorageSync('cates')
    if (cates && Date.now() - cates.time <= 1000*60*5) {
      // 如果缓存有数据并且没有超过5分钟就用缓存里面的数据
      this.cateList = cates.data
      let leftMenuList = this.cateList.map(item => item.cat_name)
      let rightContentList = this.cateList[0].children
      this.setData({
        leftMenuList,
        rightContentList
      })
    } else {
      this.getCateData()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  // 切换分类
  changeCate(e) {
    let index = e.currentTarget.dataset.index
    let rightContent = this.cateList[index].children
    this.setData({
      currentIndex: index,
      rightContentList: rightContent,
      scrollTop:0
    })
  },
  // 获取分类数据
  getCateData() {
    request({
      url: '/categories'
    }).then(res => {
      let { message, meta } = res.data
      if (meta.status == 200) {
        this.cateList = message
        wx.setStorageSync('cates', { time: Date.now(), data: this.cateList })
        let leftMenuList = this.cateList.map(item => item.cat_name)
        let rightContentList = this.cateList[0].children
        this.setData({
          leftMenuList,
          rightContentList
        })
      }
    })
  }
})
