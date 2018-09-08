// require('es6-promise').polyfill();
// require('isomorphic-fetch');
/*
fetch 请求的是异步数据，注意！！！！
*/
/**
 * 响应的状态码捕获
 * @param response 对象
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
/**
 * 相应数据设为JSON
 * @param response 对象
 */
function parseJSON(response) {
  return response.json()
}
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}

/**
 * 真正的请求
 * @param url 请求地址
 * @param options 请求参数
 * @param method 请求方式
 */
function commonFetcdh(url, options, method = 'GET') {
  url = nativeData?url:(config_service_url+url)
  const searchStr = obj2String(options)
  let initObj = {}
  if (method === 'GET') { // 如果是GET请求，拼接url
    url += '?' + searchStr
    initObj = {
      method: method,
    }
  } else {
    initObj = {
      method: method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: searchStr
    }
  }
  let dataJOSN = null;

  return fetch(url, initObj);
}

/**
 * GET请求
 * @param url 请求地址
 * @param options 请求参数
 */
function GET(url, options) {
  return commonFetcdh(url, options, 'GET')
}

/**
 * POST请求
 * @param url 请求地址
 * @param options 请求参数
 */
function POST(url, options) {
  return commonFetcdh(url, options, 'POST')
}

export default {GET, POST};
