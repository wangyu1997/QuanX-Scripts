var token = '';
var token_key = 'token_key';

const url = 'https://anti-epidemic.ecnu.edu.cn/clock/mini/record'
const id = '52195100002'
 
const timestamp = new Date().getTime()
 
var out = 10000;
 
var $nobyda = nobyda();
 
 
(async () => {
  token = token || $nobyda.read(token_key)
  
  if ($nobyda.isRequest) {
	  getCookie();
	return;
  }
	
  if(token){
	await checkin(url, token);
	await $nobyda.time();
  }
})().finally(() => {
  $nobyda.done();
})
 


function checkin(m_url, m_token) {
  return new Promise(resolve => {
	// const log_token = md5(`${name}${id}ecnu1024`)
	var payload = {
		"number": id,
		"location": "在学校",
		"health": "健康，未超过37.3",
		"recordTime": timestamp,
		"token": 'b4137c889af0689b6451a00cc7d673fd'
	}
	headers = {
	  'Content-type': 'application/json',
	  'MiniToken': m_token,
	  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
	}
	var login_req = {
		url: m_url,
		method: 'PUT',
		headers: headers,
		body: JSON.stringify(payload)
	}

	$task.fetch(login_req).then(resp => {
		data = JSON.parse(resp.body);
		console.log(data.message)
		$nobyda.notify(`ECNU ${data.message}`, "", "")
	}).catch((err) => {
	  const error = '账号信息获取失败⚠️';
	  console.log(error + '\n' + JSON.stringify(err));
	  $nobyda.notify(`ECNU ${head+error}请查看日志‼️`);
	})
	.finally(() => {
	  resolve();
	});
	
	if (out) setTimeout(resolve, out)
  })
}

function getCookie() {
  if ($request && $request.method == "GET" && $request.url.match(/mini\/record\/52195100002/)) {
	  const sitoken = $request.headers["MiniToken"];
	console.log(sitoken)
	$nobyda.write(sitoken, token_key);
	$nobyda.notify(`ECNU 获取Token成功🎉`, "", "")
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