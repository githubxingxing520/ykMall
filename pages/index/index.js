import { request } from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    navList: [],
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSwiperData()
    this.getNavData()
    this.getFloorData()
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
  // 获取轮播图数据
  getSwiperData() {
    request({
      url: '/home/swiperdata'
    }).then(res => {
      let { message, meta } = res.data
      if (meta.status == 200) {
        this.setData({
          swiperList: message
        })
      }
    })
  },
  // 请求导航数据
  getNavData() {
    request({
      url: '/home/catitems'
    }).then(res => {
      let { message, meta } = res.data
      if (meta.status == 200) {
        this.setData({
          navList: message
        })
      }
    })
  },
  // 楼层数据
  getFloorData() {
    request({
      url: '/home/floordata'
    }).then(res => {
      let { message, meta } = res.data
      if (meta.status == 200) {
        let mapResult = message.map(v=>{
          return {
            floor_title: v.floor_title, product_list: v.product_list.map(item => {
            let arr = item.navigator_url.split("?")
            item.navigator_url = arr[0] + "/index?" + arr[1]
            return item
          })}
        })
        console.log(mapResult)
        this.setData({
          floorList: mapResult
        })
      }
    })
  }
})
