var cookie = '';
var token = '';
var url = '';
var name = '';

var name_key = 'evil_checkincktitle';
const signurl = 'evil_checkinurl';
const cookie_key  = 'cookie_key';
const token_key = 'token_key';
 
const timestamp = new Date().getTime()
 
var out = 10000;
 
var $nobyda = nobyda();
 
 
(async () => {
  cookie = cookie || $nobyda.read(cookie_key)
  token = token || $nobyda.read(token_key)
  url = url || $nobyda.read(signurl)
  name = name || $nobyda.read(name_key)
  
  if ($nobyda.isRequest) {
    getCookie();
  return;
  }
  
  if(cookie && token){
  await checkin(url, cookie, token, name);
  await $nobyda.time();
  }
})().finally(() => {
  $nobyda.done();
})
 


function checkin(m_url, m_cookie, m_token,m_name) {
  return new Promise(resolve => {
  var checkinurl = m_url.replace(/(auth|user|m)\/login(.php)*/g, "") + "api_mweb/user/checkin";

  var check_req = {
    url: checkinurl,
    headers: {
    'AuthorizationMweb': m_token,
    'Cookie': m_cookie,
    'X-HTTP-Method-Override': 'PUT'
    }
  }
  $nobyda.post(check_req, function(error, response, data) {
    if (error) {
    console.log(error);
    $nobyda.notify(`${m_name} 签到失败 ${error}`, "", "")
    } else {
    if (data.match(/\"message\"\:/)) {
      data = JSON.parse(data);
      var message = '';
      if(data.message){
        message = data.message;
      }else{
        message = data.data.message;
      }
      console.log(message);
      $nobyda.notify(`${m_name} ${message}`, "", "");
    } else if (data.match(/login/)) {
    console.log(data);
    $nobyda.notify(`${m_name} ⚠️Cookie失效啦，请重新获取Cookie`, "", "")
    } else {
    console.log(data);
    $nobyda.notify(`${m_name} ⚠️签到失败，某些地方出错啦，请查看日志`, "", "")
    }
    }
    resolve()
  })
  if (out) setTimeout(resolve, out)
  })
}

function getCookie() {
  if ($request && $request.method != "OPTIONS" && $request.url.match(/check/)) {
  const sicookie = $request.headers["Cookie"];
  const siauthtoken = $request.headers["AuthorizationMweb"];
  
  console.log(sicookie);
  console.log(siauthtoken);
  
  $nobyda.write(sicookie, cookie_key);
  $nobyda.write(siauthtoken, token_key);
  $nobyda.notify(`速蛙云 获取Cookie和Token成功🎉`, "", "")
  }
}
 
function nobyda() {
  const times = 0
  const start = Date.now()
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const isLoon = typeof $loon != "undefined"
  const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
  const isNode = typeof require == "function" && !isJSBox;
  const node = (() => {
  if (isNode) {
  const request = require('request');
  return ({
  request
  })
  } else {
  return null
  }
  })()
  const notify = (title, subtitle, message) => {
  if (isQuanX) $notify(title, subtitle, message)
  if (isSurge) $notification.post(title, subtitle, message)
  if (isNode) log('\n' + title + '\n' + subtitle + '\n' + message)
  if (isJSBox) $push.schedule({
  title: title,
  body: subtitle ? subtitle + "\n" + message : message
  })
  }
  const write = (value, key) => {
  if (isQuanX) return $prefs.setValueForKey(value, key)
  if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
  if (isQuanX) return $prefs.valueForKey(key)
  if (isSurge) return $persistentStore.read(key)
  }
  const adapterStatus = (response) => {
  if (response) {
  if (response.status) {
  response["statusCode"] = response.status
  } else if (response.statusCode) {
  response["status"] = response.statusCode
  }
  }
  return response
  }
  const get = (options, callback) => {
  if (isQuanX) {
  if (typeof options == "string") options = {
  url: options
  }
  options["method"] = "GET"
  $task.fetch(options).then(response => {
  callback(null, adapterStatus(response), response.body)
  }, reason => callback(reason.error, null, null))
  }
  if (isSurge) $httpClient.get(options, (error, response, body) => {
  callback(error, adapterStatus(response), body)
  })
  if (isNode) {
  node.request(options, (error, response, body) => {
  callback(error, adapterStatus(response), body)
  })
  }
  if (isJSBox) {
  if (typeof options == "string") options = {
  url: options
  }
  options["header"] = options["headers"]
  options["handler"] = function(resp) {
  let error = resp.error;
  if (error) error = JSON.stringify(resp.error)
  let body = resp.data;
  if (typeof body == "object") body = JSON.stringify(resp.data);
  callback(error, adapterStatus(resp.response), body)
  };
  $http.get(options);
  }
  }
  const post = (options, callback) => {
  if (!options.body) options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (isQuanX) {
  if (typeof options == "string") options = {
  url: options
  }
  options["method"] = "POST"
  $task.fetch(options).then(response => {
  callback(null, adapterStatus(response), response.body)
  }, reason => callback(reason.error, null, null))
  }
  if (isSurge) {
  options.headers['X-Surge-Skip-Scripting'] = false
  $httpClient.post(options, (error, response, body) => {
  callback(error, adapterStatus(response), body)
  })
  }
  if (isNode) {
  node.request.post(options, (error, response, body) => {
  callback(error, adapterStatus(response), body)
  })
  }
  if (isJSBox) {
  if (typeof options == "string") options = {
  url: options
  }
  options["header"] = options["headers"]
  options["handler"] = function(resp) {
  let error = resp.error;
  if (error) error = JSON.stringify(resp.error)
  let body = resp.data;
  if (typeof body == "object") body = JSON.stringify(resp.data)
  callback(error, adapterStatus(resp.response), body)
  }
  $http.post(options);
  }
  }
  
  const put = (options, callback) => {
  if (!options.body) options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (isQuanX) {
  if (typeof options == "string") options = {
    url: options
  }
  options["method"] = "PUT"
  $task.fetch(options).then(response => {
    callback(null, adapterStatus(response), response.body)
  }, reason => callback(reason.error, null, null))
  }
  if (isSurge) {
  options.headers['X-Surge-Skip-Scripting'] = false
  $httpClient.put(options, (error, response, body) => {
    callback(error, adapterStatus(response), body)
  })
  }
  if (isNode) {
  node.request.put(options, (error, response, body) => {
    callback(error, adapterStatus(response), body)
  })
  }
  if (isJSBox) {
  if (typeof options == "string") options = {
    url: options
  }
  options["header"] = options["headers"]
  options["handler"] = function(resp) {
    let error = resp.error;
    if (error) error = JSON.stringify(resp.error)
    let body = resp.data;
    if (typeof body == "object") body = JSON.stringify(resp.data)
    callback(error, adapterStatus(resp.response), body)
  }
  $http.put(options);
  }
  }
 
  const log = (message) => console.log(message)
  const time = () => {
  const end = ((Date.now() - start) / 1000).toFixed(2)
  return console.log('\n 签到用时: ' + end + ' 秒')
  }
  const done = (value = {}) => {
  if (isQuanX) return $done(value)
  if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
  isRequest,
  isNode,
  notify,
  write,
  read,
  get,
  post,
  log,
  time,
  times,
  done
  }
};