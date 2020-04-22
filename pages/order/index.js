import { request } from './../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取当前页面对象，里面的options有其它页面传过来的参数
    let pages = getCurrentPages()
    let options = pages[pages.length - 1].options
    let { type } = options
    this.changeTitleByIndex(type - 1)
    this.getOrdersData(type)
  },

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
  changeTitleByIndex(currentIndex) {
    let { tabs } = this.data
    tabs.forEach((item, index) =>
      index == currentIndex ? (item.isActive = true) : (item.isActive = false)
    )
    this.setData({
      tabs
    })
  },
  // 点击tabs
  handleTabsItemTap(e) {
    let currentIndex = e.detail
    this.changeTitleByIndex(currentIndex)
    this.getOrdersData(currentIndex + 1)
  },
  // 获取历史订单数据
  async getOrdersData(type) {
    let token = wx.getStorageSync('token')
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   })
    //   return
    // }
    let header = {
      Authorization: token
    }
    let res = await request({ url: '/my/orders/all', data: { type }, header })
    let { meta, message } = res.data
    if (meta.status == 200) {
      this.setData({
        orderList: message.orders.map(v => ({ ...v, create_time_cn: new Date(v.create_time * 1000).toLocaleString()}))
      })
    }
  }
})
