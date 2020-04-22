// pages/goods_list/index.js
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
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口参数
  queryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryParams.cid = options.cat_id||""
    this.queryParams.query = options.query||""
    this.getGoodsListData()
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
  onPullDownRefresh: function() {
    // 1.清空列表数据
    // 2.重置pagenum
    // 3.重新请求接口数据
    // 4.数据请求回来，手动关闭下拉刷新窗口
    this.setData({
      goodsList:[]
    })
    this.queryParams.pagenum=1
    this.getGoodsListData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.queryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有更多数据了',
        icon:"none"
      })
      return
    }
    this.queryParams.pagenum++
    this.getGoodsListData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  // 商品列表数据
  async getGoodsListData() {
    let res = await request({ url: '/goods/search', data: this.queryParams })
    let { meta, message } = res.data
    if (meta.status == 200) {
      this.totalPages = Math.ceil(message.total/this.queryParams.pagesize)
      let goodsList = this.data.goodsList.concat(message.goods)
      this.setData({
        goodsList
      })
      wx.stopPullDownRefresh()
    }
  },
  handleTabsItemTap(e) {
    let currentIndex = e.detail
    let { tabs } = this.data
    tabs.forEach((item, index) =>
      index == currentIndex ? (item.isActive = true) : (item.isActive = false)
    )
    this.setData({
      tabs
    })
  }
})
