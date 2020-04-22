// pages/cart/index.js
import { request } from './../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    carts: [],
    totalNum: 0,
    totalPrice: 0
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
    let address = wx.getStorageSync('address') || null
    let carts = wx.getStorageSync('cart') || []
    carts = carts.filter(v => v.is_check)
    let totalNum = 0
    let totalPrice = 0
    carts.forEach(v => {
      totalNum += v.num
      totalPrice += v.num * v.goods_price
    })
    this.setData({
      address,
      carts,
      totalNum,
      totalPrice
    })
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
  // 点击支付
  async handleOrderPay() {
    try {
      // 1.判断本地缓存是否有token，没有就跳转到授权页面，有就获取订单
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      }
      // 创建订单，获得订单编号
      let { totalPrice, address, carts } = this.data
      let goods = []
      carts.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      let queryParams = {
        order_price: totalPrice,
        consignee_addr: address,
        goods
      }
      let header = {
        Authorization: token
      }
      let res = await request({
        url: '/my/orders/create',
        method: 'POST',
        data: queryParams,
        header
      })
      let { meta, message } = res.data
      if (meta.status == 200) {
        let order_number = message.order_number
        // 发起预支付接口
        let { data } = await request({
          url: '/my/orders/req_unifiedorder',
          method: 'POST',
          data: { order_number },
          header
        })
        if (data.meta.status == 200) {
          let pay = data.message.pay
          // 发起微信支付
          wx.requestPayment({
            ...pay,
            success: async result => {
              //查询订单支付状态
              let { data } = await request({
                url: '/my/orders/chkOrder',
                method: 'POST',
                data: { order_number },
                header
              })
              if (data.meta.status == 200) {
                // 支付完成删除缓存中已支付的商品，并跳转到订单页
                let carts = wx.getStorageSync('cart')
                wx.showToast({
                  title: '支付成功',
                  success: () => {
                    carts = carts.filter(v => !v.is_check)
                    wx.setStorageSync('cart', carts)
                    wx.navigateTo({ url: '/pages/order/index' })
                  }
                })
              }
            }
          })
        }
      }
    } catch (error) {
      wx.showToast({
        title: '支付失败'
      })
      console.log(error)
    }
  }
})
