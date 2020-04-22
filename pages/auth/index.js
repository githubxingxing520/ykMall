// pages/auth/index.js
import { request } from './../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {},

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
  // 获取授权
  handleGetUserInfo(e) {
    // 1.通过获取用户信息获取到encryptedData、rawData、iv、signature等字段
    let { encryptedData, rawData, iv, signature } = e.detail
    // 2.通过登录api获取code字段
    wx.login({
      timeout: 10000,
      success: async result => {
        let code = result.code
        // 3.获取token
        let queryParams = {
          encryptedData,
          rawData,
          iv,
          signature,
          code
        }
        let res = await request({
          url: '/users/wxlogin',
          method: 'POST',
          data: queryParams
        })
        let { meta, message } = res.data
        if (meta.status == 200) {
          wx.setStorageSync('token', message.token)
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: () => {},
      complete: () => {}
    })
  }
})
