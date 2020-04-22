// components/Tabs/Tabs.js
Component({
  externalClasses: ['i-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击tabs
    hanldeTabTap(e){
      let currentIndex = e.currentTarget.dataset.index
      this.triggerEvent("tabsItemTap",currentIndex)
    }
  }
})
