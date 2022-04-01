import axios from 'axios'

class Request {
  constructor (config) {
    this.instance = axios.create(config)
    this.interceptorsObj = config.interceptors

    this.instance.interceptors.request.use(
      (res) => {
        console.log('全局请求拦截器')
        return res
      },
      (err) => err
    )
    // 使用实例拦截器
    this.instance.interceptors.request.use(
        this.interceptorsObj?.requestInterceptors,
        this.interceptorsObj?.requestInterceptorsCatch
    )
    this.instance.interceptors.response.use(
        this.interceptorsObj?.responseInterceptors,
        this.interceptorsObj?.responseInterceptorsCatch
    )
    // 全局响应拦截器保证最后执行
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res) => {
        console.log('全局响应拦截器')
        return res.data
      },
      (err) => err
    )
  }
  /**
 * @description 网络请求发送
 * @param {String} method 网络请求类型 get/post
 * @param {String} url 网络请求地址
 * @param {Object} params 请求传参
 * @param {Boolean} [isNeedBiz=true] 是否需要在传参外层用 bizData 变量包裹。例如：传参为{a: 1}，用bizData包裹后为{bizData: {a: 1}}
 * @param {Object} [config={}] 网络请求额外配置，如timeout,
 * @param {Boolean} [isNeedStatus=false]
 * @param {Boolean} [isNeedReportData=false] 是否需要上报接口data内容
 */
  request (method, url, params, isNeedBiz = false, config = {}, isNeedStatus = false, isNeedReportData = true) {
    let theUrl = url.startsWith('http') ? url : `${window.location.origin}/${url}`
    if (method === 'get') {
      isNeedBiz = false
    }
    let theParams = isNeedBiz ? { bizData: params } : params
    config && config.headers && (theParams = qs.stringify(params))
    let theConfig = config
    let dataKey = method === 'get' ? 'params' : 'data'
    return new Promise((resolve, reject) => {
      // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config)
      }
      this.instance
        .request(config)
        .then(res => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res)
          }

          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default Request
