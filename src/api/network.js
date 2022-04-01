import Request from './request'
import qs from 'qs'

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
/* eslint-disable-next-line */
const send = (method, url, params, isNeedBiz = true, config = {}, isNeedStatus = false, isNeedReportData = true) => {

  let theUrl = url.startsWith('http') ? url : `${window.location.origin}/${url}`
  if (method === 'get') {
    isNeedBiz = false
  }
  let theParams = isNeedBiz ? { bizData: params } : params
  config && config.headers && (theParams = qs.stringify(params))
  let theConfig = config
  let dataKey = method === 'get' ? 'params' : 'data'
  return new Promise((resolve) => {
    new Request({
        // baseURL: import.meta.env.BASE_URL,
        method,
        url: theUrl,
        [dataKey]: theParams,
        ...theConfig,
        timeout: 1000 * 60 * 5,
        interceptors: {
          // 请求拦截器
          requestInterceptors: config => {
            console.log('实例请求拦截器')
      
            return config
          },
          // 响应拦截器
          responseInterceptors: result => {
            console.log('实例响应拦截器')
            return result
          }
        })
    axios({
      method,
      url: theUrl,
      [dataKey]: theParams,
      ...theConfig
    })
      .then((res) => {
        if (isNeedStatus) {
          Object.assign(res.data, { responseStatus: res.status })
        }
        myResolve(res.data)
        if (process.env.VUE_APP_TYPE !== 'prod' && res.data.code !== 0) {
          !XiaoeConsole.inited && XiaoeConsole.init()
          XiaoeConsole.push({
            url,
            error: JSON.stringify(res.data)
          })
        }
      })
      .catch((error) => {
        // 错误报告展示只在主干、测试环境出现
        if (process.env.VUE_APP_TYPE !== 'prod') {
          !XiaoeConsole.inited && XiaoeConsole.init()
          XiaoeConsole.push({
            url,
            error: error.message
          })
        }
        let response = error.response
        // 注：error.response不一定有值，比如接口请求超时情况下，就没有值
        if (!response) {
          response = {
            data: {
              code: -10,
              msg: error.message || '',
              status: 0, // http状态码
              responseStatus: 0
            },
            config: {},
            statusText: error.message || ''
          }
        } else {
          if (response.data !== '' && typeof response.data !== 'string') {
            response.data['status'] = response.status // http状态码
            response.data['responseStatus'] = response.status // 给这个字段也赋值状态码
          }
        }

        // isNeedReportData && (reportParams.api_data = error); es上报改版暂不上报接口请求结果
        requestApiReport(reportParams, 'error')
        myResolve(response.data)
      })
  })
}

export const request = new Request({
  baseURL: import.meta.env.BASE_URL,
  timeout: 1000 * 60 * 5,
  interceptors: {
    // 请求拦截器
    requestInterceptors: config => {
      console.log('实例请求拦截器')

      return config
    },
    // 响应拦截器
    responseInterceptors: result => {
      console.log('实例响应拦截器')
      return result
    }
  }
})
