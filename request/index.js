let ajaxCount = 0
export const request = params => {
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    ajaxCount++
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
        ajaxCount--
        if (ajaxCount == 0) {
          wx.hideLoading()
        }
      }
    })
  })
}
// 可封装处：跟后台约定好，需要带token的接口用特殊url区别，可以判断url是否包含特定开头，从而动态添加header，免得每个需要带token的接口都要添加一次header
