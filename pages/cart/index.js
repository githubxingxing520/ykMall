// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    carts: [],
    allChecked: false,
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
    // 购物车没有添加商品carts为空数组，用every遍历会返回true，所以要判断空数组情况
    // let allChecked =
    //   carts.length > 0 ? carts.every(v => v.is_check == true) : false
    this.setData({ address })
    this.setCart(carts)
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
  // 添加收货地址
  handleAddAddress() {
    wx.getSetting({
      success: result => {
        if (
          result.authSetting['scope.address'] ||
          result.authSetting['scope.address'] == undefined
        ) {
          // 如果scope.address为true说明用户授权过，如果为undefined说明用户第一次点击
          wx.chooseAddress({
            success: result1 => {
              wx.setStorageSync('address', result1)
            }
          })
        } else {
          // scope.address为false说明用户上一次拒绝过授权，应该弹出权限设置菜单让用户手动设置权限
          wx.openSetting({
            success: result => {
              wx.chooseAddress({
                success: result1 => {
                  wx.setStorageSync('address', result1)
                }
              })
            }
          })
        }
      }
    })
  },
  // 点击checkbox
  handleChangeCheckBox(e) {
    let goodsId = e.currentTarget.dataset.id
    let { carts } = this.data
    let index = carts.findIndex(v => v.goods_id == goodsId)
    carts[index].is_check = !carts[index].is_check
    this.setCart(carts)
  },
  // 点击全选checkbox
  handleChangeAllCheckBox(e) {
    let { allChecked, carts } = this.data
    allChecked = !allChecked
    if (allChecked) {
      // 勾选全选，遍历购物车所有商品，把每一项is_check改为true
      carts.forEach(v => {
        v.is_check = true
      })
    } else {
      // 没有勾选全选，遍历购物车所有商品，把每一项is_check改为false
      carts.forEach(v => {
        v.is_check = false
      })
    }
    this.setData({ allChecked })
    // 重新计算购物车商品
    this.setCart(carts)
  },
  // 封装公共代码
  setCart(carts) {
    let allChecked = true
    let totalNum = 0
    let totalPrice = 0
    carts.forEach(v => {
      if (v.is_check) {
        totalNum += v.num
        totalPrice += v.num * v.goods_price
      } else {
        allChecked = false
      }
    })
    // 如果购物车没有商品，去掉全选按钮勾选
    allChecked = carts.length != 0 ? allChecked : false
    this.setData({
      carts,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', carts)
  },
  // 商品数量+-
  handleChangeGoodsNum(e) {
    let { operator, id: goods_id } = e.currentTarget.dataset
    let { carts } = this.data
    let index = carts.findIndex(v => v.goods_id == goods_id)
    if (index != -1) {
      if (carts[index].num <= 1 && operator == -1) {
        // 当数量为1，并且用户点击了-号,弹窗提示是否删除商品
        wx.showModal({
          title: '提示',
          content: '是否删除该商品？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#eb4450',
          confirmText: '确定',
          confirmColor: '#eb4450',
          success: result => {
            if (result.confirm) {
              // 用户点击确定，从购物车移除该商品
              carts.splice(index, 1)
              this.setCart(carts)
            }
          }
        })
      } else {
        carts[index].num += operator
        this.setCart(carts)
      }
    }
  },
  // 点击结算
  handleGoPay(){
    // 判断是否添加了收货地址和购物车是否有商品并且选中
    let {address,totalNum} = this.data
    if(!address){
      wx.showToast({
        title: '您还没有添加收货地址',
        icon:"none"
      })
      return
    }
    if (totalNum==0){
      wx.showToast({
        title: '您还没有选购商品',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})
