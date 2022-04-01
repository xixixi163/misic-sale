
// import { getUUID } from './fuc_tools'

import axios from 'axios'
import qs from 'qs'

const CancelToken = axios.CancelToken
let source = CancelToken.source()
const customAxios = axios.create()
// eslint-disable-next-line camelcase
const de_notCancelGroups = ['learning_record', 'error_report', 'audio_action_analyse'] // 不能取消的请求组别
// eslint-disable-next-line camelcase
const de_codeWhiteGroups = [0] // code码的白名单,默认为[0]

// 报错请求重试
const axiosRetryInterceptor = err => {
  let config = err.config
  // 请求超时或者错误请求默认尝试第2次，间隔1s
  config.retryDelay = 1000
  config.retry = config.headers.retry ? config.headers.retry : 1
  if (!config || !config.retry) {
    return Promise.reject(err)
  }
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err)
  }
  config.__retryCount += 1
  let retryAxios = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })
  // 还原之前经过转换的数据格式，以便重新请求
  config.data = qs.parse(config.data)
  config.transformRequest = [
    data => {
      return transRequestData(data)
    }
  ]

  return retryAxios.then(function () {
    return customAxios(config)
  })
}

customAxios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

customAxios.interceptors.response.use(response => {
  return response
}, axiosRetryInterceptor)

export const cancelAllRequest = () => {
  source.cancel && source.cancel()
  source = CancelToken.source()
}

/**
 * 转换请求参数数据格式，加上外部包裹 pack
 * @param {Object} data 请求的数据信息
 * @param {string} pack 请求参数包装在什么字段中，默认为无
 */
const transRequestData = (data, pack = '') => {
  let obj = {}
  let val = null
  for (let it in data) {
    val = data[it]
    if (pack) {
      obj[`${pack}[${it}]`] = val
    } else {
      obj[`${it}`] = val
    }
  }
  return qs.stringify(obj)
}

/** 调用请求
 * @param {object} axiosPromise   axios实例
 * @param {string} url  请求路径
 * @param {object} params 请求参数
 * @param {string} timestamp 请求开始时间
 * @param {Array} codeGroups 请求code码白名单
 * @returns
 */
const getAxiosRes = (axiosPromise, {url, params, timestamp, codeGroups}) => {
  return axiosPromise
    .then(response => {
      const data = response.data
      //   let api_is_success = 0
      if (data.hasOwnProperty('code') && codeGroups.includes(data.code)) {
        // api_is_success = 1
      }
      try {
        // 上报接口质量
        // let apiMsg = api_is_success === 1 ? '' : data
        // apiReport(url, api_is_success, params, timestamp, response.status, apiMsg);
      } catch (e) {
        console.log(e)
      }
      return data
    })
    .catch(error => {
      try {
        // 上报接口质量
        // apiReport(url, 0, params, timestamp, 400, error);
      } catch (e) {
        console.log(e)
      }
      console.log(error)
      return Promise.resolve({ code: -10 })
    })
}

/**
 * 异步请求方法,错误code码请求默认尝试2次，支持业务侧自定义
 * @param {string} url 业务路由，不要带斜杠，直接写业务路由
 * @param {object} params 请求参数
 * @param {string} responseType 返回数据格式，默认为json
 * @param {string} pack 请求参数包装在什么字段中，默认为'bizData'
 * @param {string} method 请求方法，默认为post
 * @param {Number} timeout 请求超时，中断请求，默认为无限制
 * @param {string}  group 请求组别，用于分类取消请求，默认为空
 * @param {Boolean} isRetry 请求错误code码，是否重试，默认为false,由业务侧决定是否重试
 * @param {Number} retryCount 请求超时或者错误请求默认再尝试1次，共请求2次，间隔1s
 * @param {Array} codeWhiteGroups code码的白名单，默认[0]
 * @param {Array} notCancelGroups 不能取消的请求的组别集合，默认['learning_record', 'error_report', 'audio_action_analyse']
 * @param {String} requestType 请求类型,支持form , json
 */
export const request = ({
  url,
  params,
  responseType = 'json',
  pack = 'bizData',
  method = 'post',
  timeout = 6000,
  isRetry = false,
  retryCount = 1,
  group = '',
  notCancelGroups,
  codeWhiteGroups,
  requestType = 'form',
  headersParams = {}
}) => {
  const contentTypeObj = {
    form: 'application/x-www-form-urlencoded',
    json: 'application/json'
  }
  // 设置开始时间用以计算接口时间
  let timestamp = new Date().getTime()
  let paramsObj = method === 'post' ? { data: params } : { params }

  let urlRex = /^\/|http.*/i
  return new Promise((resolve, reject) => {
    console.log(headersParams, ...headersParams, 666);
    let axiosConfig = {
      url: urlRex.test(url) ? url : `/${url}`,
      method,
      ...paramsObj,
      responseType,
      group,
      timeout,
      headers: {
        'Content-Type': contentTypeObj[requestType] || 'application/x-www-form-urlencoded',
        retry: retryCount,
        ...headersParams
        // 'Req-UUID': getUUID()
      }
    }

    if (requestType === 'form') {
      axiosConfig.transformRequest = [
        data => {
          return transRequestData(data, pack)
        }
      ]
    }

    // 合并外部传入的code白名单值
    // eslint-disable-next-line camelcase
    let codeGroups = de_codeWhiteGroups
    if (codeWhiteGroups && Array.isArray(codeWhiteGroups)) {
      codeGroups = codeGroups.concat(codeWhiteGroups)
    }
    // 合并外部传入的不能取消请求的组别白名单
    // eslint-disable-next-line camelcase
    let cancelWhiteGroups = de_notCancelGroups
    if (notCancelGroups && Array.isArray(notCancelGroups)) {
      cancelWhiteGroups = cancelWhiteGroups.concat(notCancelGroups)
    }
    // 过滤不能取消请求的组别
    if (!cancelWhiteGroups.includes(group)) {
      axiosConfig.cancelToken = source.token
    }

    let axiosPromise = customAxios(axiosConfig)
    // 调用请求返回，不在白名单的请求默认再执行一次
    let axiosParams = {url, params, timestamp, codeGroups}
    let resPromise = getAxiosRes(axiosPromise, { ...axiosParams })
    resPromise.then(res => {
      // 不在白名单的请求默认，再请求一次
      if (res.hasOwnProperty('code')) {
        if (!codeGroups.includes(res.code) && isRetry) {
          // 重新初始实例，再次请求
          getAxiosRes(customAxios(axiosConfig), { ...axiosParams }).then(res => {
            resolve(res)
          })
        } else {
          resolve(res)
        }
      } else {
        resolve({ code: -10 })
      }
    })
  }).catch((err) => {
    console.log(err);
    return Promise.resolve({ code: -10 })
  })
}

// 去除bizData参数包裹，外部不需要传pack=='',来去除参数包裹
export const ajax = ({
  url,
  params,
  responseType = 'json',
  pack = '',
  method = 'post',
  timeout = 6000,
  isRetry = false,
  retryCount = 1,
  group = '',
  notCancelGroups,
  codeWhiteGroups
}) => {
  return request({
    url,
    params,
    responseType,
    pack,
    method,
    timeout,
    isRetry,
    retryCount,
    group,
    notCancelGroups,
    codeWhiteGroups})
}

export default {
  request,
  cancelAllRequest,
  ajax
}
