import { request } from './../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {},
    is_collect: false
  },
  goodsObj: {},
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
    let pages = getCurrentPages()
    let { goods_id } = pages[pages.length - 1].options
    this.getGoodsDetailData(goods_id)
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
  // 获取商品详情数据
  async getGoodsDetailData(goods_id) {
    let res = await request({
      url: '/goods/detail',
      data: { goods_id: goods_id }
    })
    console.log(res)
    let { message, meta } = res.data
    if (meta.status == 200) {
      this.goodsObj = message
      // 判断缓存中是否收藏过该商品
      let collect = wx.getStorageSync('collect') || []
      let is_collect = collect.some(v => v.goods_id == this.goodsObj.goods_id)

      this.setData({
        goodsInfo: {
          goods_name: message.goods_name,
          goods_price: message.goods_price,
          goods_introduce: message.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics: message.pics
        },
        is_collect
      })
    }
  },
  // 点击图片预览大图
  previewImage(e) {
    let pics = this.data.goodsInfo.pics.map(item => item.pics_big)
    wx.previewImage({
      urls: pics,
      current: pics[e.currentTarget.dataset.index]
    })
  },
  // 点击加入购物车
  handleAddCart() {
    let carts = wx.getStorageSync('cart') || []
    let index = carts.findIndex(v => v.goods_id == this.goodsObj.goods_id)
    if (index == -1) {
      this.goodsObj.num = 1
      this.goodsObj.is_check = true
      carts.push(this.goodsObj)
    } else {
      carts[index].num++
    }
    wx.showToast({
      title: '添加成功',
      mask: true
    })
    wx.setStorageSync('cart', carts)
  },
  // 点击收藏
  handleCollect() {
    let { is_collect } = this.data
    // 查询本地缓存当然商品是否收藏过，收藏过就移除掉，没收藏就push进去
    let collect = wx.getStorageSync('collect') || []
    let index = collect.findIndex(v => v.goods_id == this.goodsObj.goods_id)
    if (index == -1) {
      // 没收藏过
      collect.push(this.goodsObj)
      wx.showToast({
        title: '收藏成功',
        mask:true
      })
    } else {
      // 收藏过
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏',
        mask: true
      })
    }
    this.setData({ is_collect: !is_collect })
    wx.setStorageSync('collect', collect)
  }
})
