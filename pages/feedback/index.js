// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    chooseImgList:[],//选择的图片集合
    inputValue:""
  },

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
  handleTabsItemTap(e) {
    let currentIndex = e.detail
    let { tabs } = this.data
    tabs.forEach((item, index) =>
      index == currentIndex ? (item.isActive = true) : (item.isActive = false)
    )
    this.setData({
      tabs
    })
  },
  // 点击选择图片
  handleChooseImg(){
    wx.chooseImage({
      sourceType: ["album"],
      success: res=>{
        // 把选择的图片保存到data中
        let { tempFilePaths} = res
        this.setData({
          chooseImgList:[...this.data.chooseImgList,...tempFilePaths]
        })
      }
    })
  },
  // 点击X移除图片
  handleRemoveImg(e) {
    let { index } = e.currentTarget.dataset
    let { chooseImgList} = this.data
    chooseImgList.splice(index,1)
    this.setData({ chooseImgList})
  },
  // texterea输入
  handleInput(e){
    let {value} = e.detail
    this.setData({
      inputValue:value
    })
  },
  // 点击提交
  handleSubmit(){
    // 校验texterea内容合法性
    let {inputValue,chooseImgList} = this.data
    if(!inputValue.trim()){
      wx.showToast({
        title: '请描述问题！',
        icon:"none",
        mask:true
      })
      return
    }

   chooseImgList.forEach(v=>{
     wx.uploadFile({
       url: 'https://images.ac.cn/api/upload/upload',
       filePath: v,
       name: 'file',
       formData: {
         "apiType": "ali,Upload_Cc",
         "privateStorage": "",
         "initialPreviewThumbTags": [],
         "initialPreviewConfig": [],
         "initialPreview": []

       },
       success: (res) => {
         console.log(res)
       }
     })
   })
  }
})