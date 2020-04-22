// pages/search/index.js
import { request } from './../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    isFocus:false,
    inputValue:""
  },
  // 定时器id
  timerId:-1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 输入框input改变，查询商品
  handleSearch(e){
    let query = e.detail.value
    if(!query.trim()){
      this.setData({
        isFocus:false,
        goodsList:[]
      })
      clearTimeout(this.timerId)
      return
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.timerId)
    this.timerId = setTimeout(async()=>{
      let {data} = await request({ url:"/goods/qsearch",data:{query}})
      if(data.meta.status==200){
        this.setData({
          goodsList:data.message
        })
      }
    },1000)
  },
  // 取消按钮
  handleReset(){
    this.setData({
      inputValue:"",
      goodsList:[],
      isFocus:false
    })
  }
})