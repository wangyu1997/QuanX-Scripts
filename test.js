var $ = API('ECNU');

var token = '';
var token_key = 'token_key';

const url = 'https://anti-epidemic.ecnu.edu.cn/clock/mini/record'
const id = '52195100002'
 
const timestamp = new Date().getTime()
 
var out = 10000;
 
var $nobyda = nobyda();
 
 
(async () => {
  token = token || $nobyda.read(token_key)
  console.log(token)
  
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
	console.log(m_url)
	console.log(m_token)
	// const log_token = md5(`${name}${id}ecnu1024`)
	var payload = {
		"number": id,
		"location": "在学校",
		"health": "健康，未超过37.3",
		"recordTime": timestamp,
		"token": 'b4137c889af0689b6451a00cc7d673fd'
	}
	console.log(payload)
	console.log(timestamp)
	var login_req = {
		url: m_url,
		method: 'PUT',
		headers: {
		  'Content-type': 'application/json',
		  'MiniToken': m_token,
		},
		body: JSON.stringify(payload)
	}
	console.log(JSON.stringify(payload))
	console.log(m_url)
	$task.fetch(login_req).then(resp => {
	  	console.log(resp)
		console.log(resp.body)
		console.log($.toStr(resp.body))
	}).catch((err) => {
	  const error = '账号信息获取失败⚠️';
	  $.error(error + '\n' + $.toStr(err));
	  $.notify($.name, '', `${head+error}请查看日志‼️`);
	})
	.finally(() => {
	  resolve();
	});
	// $.http.put(login_req)
	// .then((resp) => {
	//   console.log(resp)
	//   console.log(resp.body)
	//   console.log($.toStr(resp.body))
	//   // $.log(`\nTotal body: \n${$.toStr(resp)}`);
	//   // data = $.toObj(resp.body);
	//   // console.log(data)
	//   // total = data.body.tripCoins;
	//   // info += `无忧币总计：${total}💰\n`;
	// })
	// .catch((err) => {
	//   const error = '账号信息获取失败⚠️';
	//   $.error(error + '\n' + err);
	//   $.notify($.name, '', `${head+error}请查看日志‼️`);
	// })
	// .finally(() => {
	//   resolve();
	// });
	
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


// 随机 User-Agent
function GetRandomUA() {
  const USER_AGENTS=['Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip'];
  const RANDOM_UA = USER_AGENTS[Math.min(Math.floor(Math.random() * USER_AGENTS.length), USER_AGENTS.length)];
  return RANDOM_UA;
}

// prettier-ignore
/*********************************** API *************************************/
function ENV() {
	const t = 'undefined' != typeof $task,
		e = 'undefined' != typeof $loon;
	return {
		isQX: t,
		isLoon: e,
		isSurge: 'undefined' != typeof $httpClient && !e,
		isNode: 'undefined' != typeof module && !!module.exports,
		isRequest: 'undefined' != typeof $request,
		isScriptable: 'undefined' != typeof importModule
	}
}

function HTTP(t = {
	baseURL: ''
}) {
	const {
		isQX: e,
		isLoon: s,
		isSurge: o,
		isNode: i,
		isScriptable: n
	} = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
	const h = {};
	return ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'].forEach(c => h[c.toLowerCase()] = (h => (function (h, c) {
		c = 'string' == typeof c ? {
			url: c
		} : c;
		const l = t.baseURL;
		l && !r.test(c.url || '') && (c.url = l ? l + c.url : c.url), c && c.body && c.headers && !c.headers['Content-Type'] && (c.headers['Content-Type'] = 'application/json');
		const a = (c = {...t, ...c
			}).timeout,
			_ = {... {
					onRequest: () => {}, onResponse: t => t,
					onTimeout: () => {}
				}, ...c.events
			};
		let p, u;
		if (_.onRequest(h, c), e) p = $task.fetch({
			method: h,
			...c
		});
		else if (s || o || i) p = new Promise((t, e) => {
			(i ? require('request') : $httpClient)[h.toLowerCase()](c, (s, o, i) => {
				s ? e(s) : t({
					statusCode: o.status || o.statusCode,
					headers: o.headers,
					body: i
				})
			})
		});
		else if (n) {
			const t = new Request(c.url);
			t.method = h, t.headers = c.headers, t.body = c.body, p = new Promise((e, s) => {
				t.loadString().then(s => {
					e({
						statusCode: t.response.statusCode,
						headers: t.response.headers,
						body: s
					})
				}).catch(t => s(t))
			})
		}
		const d = a ? new Promise((t, e) => {
			u = setTimeout(() => (_.onTimeout(), e(`${h} URL: ${c.url} exceeds the timeout ${a} ms`)), a)
		}) : null;
		return (d ? Promise.race([d, p]).then(t => (clearTimeout(u), t)) : p).then(t => _.onResponse(t))
	})(c, h))), h
}

function API(t = 'untitled', e = !1) {
	const {
		isQX: s,
		isLoon: o,
		isSurge: i,
		isNode: n,
		isScriptable: r
	} = ENV();
	return new class {
		constructor(t, e) {
			this.name = t, this.debug = e, this.http = HTTP(), this.env = ENV(), n && (this.isMute = process.env.isMute || this.isMute, this.isMuteLog = process.env.isMuteLog || this.isMuteLog), this.startTime = (new Date).getTime(), console.log(`\ud83d\udd14${t}, \u5f00\u59cb!`), this.node = (() => {
				if (n) {
					return {
						fs: require('fs')
					}
				}
				return null
			})(), this.initCache();
			Promise.prototype.delay = function (t) {
				return this.then(function (e) {
					return ((t, e) => new Promise(function (s) {
						setTimeout(s.bind(null, e), t)
					}))(t, e)
				})
			}
		}
		initCache() {
			if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || '{}')), (o || i) && (this.cache = JSON.parse($persistentStore.read(this.name) || '{}')), n) {
				let t = 'root.json';
				this.node.fs.existsSync(t) || this.node.fs.writeFileSync(t, JSON.stringify({}), {
					flag: 'wx'
				}, t => console.log(t)), this.root = {}, t = `${this.name}.json`, this.node.fs.existsSync(t) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(t, JSON.stringify({}), {
					flag: 'wx'
				}, t => console.log(t)), this.cache = {})
			}
		}
		persistCache() {
			const t = JSON.stringify(this.cache, null, 2);
			s && $prefs.setValueForKey(t, this.name), (o || i) && $persistentStore.write(t, this.name), n && (this.node.fs.writeFileSync(`${this.name}.json`, t, {
				flag: 'w'
			}, t => console.log(t)), this.node.fs.writeFileSync('root.json', JSON.stringify(this.root, null, 2), {
				flag: 'w'
			}, t => console.log(t)))
		}
		write(t, e) {
			if (this.log(`SET ${e}`), -1 !== e.indexOf('#')) {
				if (e = e.substr(1), i || o) return $persistentStore.write(t, e);
				if (s) return $prefs.setValueForKey(t, e);
				n && (this.root[e] = t)
			} else this.cache[e] = t;
			this.persistCache()
		}
		read(t) {
			return this.log(`READ ${t}`), -1 === t.indexOf('#') ? this.cache[t] : (t = t.substr(1), i || o ? $persistentStore.read(t) : s ? $prefs.valueForKey(t) : n ? this.root[t] : void 0)
		}
		delete(t) {
			if (this.log(`DELETE ${t}`), -1 !== t.indexOf('#')) {
				if (t = t.substr(1), i || o) return $persistentStore.write(null, t);
				if (s) return $prefs.removeValueForKey(t);
				n && delete this.root[t]
			} else delete this.cache[t];
			this.persistCache()
		}
		notify(t, e = '', r = '', h = {}) {
			const c = h['open-url'],
				l = h['media-url'];
			if (r = r.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ''), !this.isMute) {
				if (s && $notify(t, e, r, h), i && $notification.post(t, e, r + `${l?'\n\u591a\u5a92\u4f53:'+l:''}`, {
					url: c
				}), o) {
					let s = {};
					c && (s.openUrl = c), l && (s.mediaUrl = l), '{}' === this.toStr(s) ? $notification.post(t, e, r) : $notification.post(t, e, r, s)
				}
				n && new Promise(async s => {
					const o = (e ? `${e}\n` : '') + r + (c ? `\n\u70b9\u51fb\u8df3\u8f6c: ${c}` : '') + (l ? '\n\u591a\u5a92\u4f53: ' + l : '');
					await this.sendNotify(t, o, {
						url: c
					})
				})
			}
			if (!this.isMuteLog) {
				let s = ['', '==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============='];
				s.push(t), e && s.push(e), r && s.push(r), c && s.push(`\u70b9\u51fb\u8df3\u8f6c: ${c}`), l && s.push(`\u591a\u5a92\u4f53: ${l}`), console.log(s.join('\n'))
			}
		}
		sendNotify(t, e, s = {}) {
			return new Promise(async o => {
				this.querystring = require('querystring'), this.timeout = this.timeout || '15000', e += this.author || '\n\n\u4ec5\u4f9b\u7528\u4e8e\u5b66\u4e60 https://ooxx.be/js', this.setParam(), await Promise.all([this.serverNotify(t, e), this.pushPlusNotify(t, e)]), t = t.match(/.*?(?=\s?-)/g) ? t.match(/.*?(?=\s?-)/g)[0] : t, await Promise.all([this.BarkNotify(t, e, s), this.tgBotNotify(t, e), this.ddBotNotify(t, e), this.qywxBotNotify(t, e), this.qywxamNotify(t, e), this.iGotNotify(t, e, s), this.gobotNotify(t, e)])
			})
		}
		setParam() {
			this.SCKEY = process.env.SCKEY || this.SCKEY, this.PUSH_PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN || this.PUSH_PLUS_TOKEN, this.PUSH_PLUS_USER = process.env.PUSH_PLUS_USER || this.PUSH_PLUS_USER, this.BARK_PUSH = process.env.BARK_PUSH || this.BARK_PUSH, this.BARK_SOUND = process.env.BARK_SOUND || this.BARK_SOUND, this.BARK_GROUP = process.env.BARK_GROUP || 'AsVow', this.BARK_PUSH && !this.BARK_PUSH.includes('http') && (this.BARK_PUSH = `https://api.day.app/${this.BARK_PUSH}`), this.TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || this.TG_BOT_TOKEN, this.TG_USER_ID = process.env.TG_USER_ID || this.TG_USER_ID, this.TG_PROXY_AUTH = process.env.TG_PROXY_AUTH || this.TG_PROXY_AUTH, this.TG_PROXY_HOST = process.env.TG_PROXY_HOST || this.TG_PROXY_HOST, this.TG_PROXY_PORT = process.env.TG_PROXY_PORT || this.TG_PROXY_PORT, this.TG_API_HOST = process.env.TG_API_HOST || 'api.telegram.org', this.DD_BOT_TOKEN = process.env.DD_BOT_TOKEN || this.DD_BOT_TOKEN, this.DD_BOT_SECRET = process.env.DD_BOT_SECRET || this.DD_BOT_SECRET, this.QYWX_KEY = process.env.QYWX_KEY || this.QYWX_KEY, this.QYWX_AM = process.env.QYWX_AM || this.QYWX_AM, this.IGOT_PUSH_KEY = process.env.IGOT_PUSH_KEY || this.IGOT_PUSH_KEY, this.GOBOT_URL = process.env.GOBOT_URL || this.GOBOT_URL, this.GOBOT_TOKEN = process.env.GOBOT_TOKEN || this.GOBOT_TOKEN, this.GOBOT_QQ = process.env.GOBOT_QQ || this.GOBOT_QQ
		}
		serverNotify(t, e, s = 2100) {
			return new Promise(o => {
				if (this.SCKEY) {
					e = e.replace(/[\n\r]/g, '\n\n');
					const i = {
						url: this.SCKEY.includes('SCT') ? `https://sctapi.ftqq.com/${this.SCKEY}.send` : `https://sc.ftqq.com/${this.SCKEY}.send`,
						body: `text=${t}&desp=${e}`,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						timeout: this.timeout
					};
					setTimeout(() => {
						this.http.post(i).then(t => {
							const e = this.toObj(t.body);
							0 === e.errno || 0 === e.data.errno ? console.log('server\u9171\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\n') : 1024 === e.errno ? console.log(`server\u9171\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5f02\u5e38: ${e.errmsg}\n`) : console.log(`server\u9171\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5f02\u5e38\n${this.toStr(e)}`)
						}).catch(t => {
							console.log('server\u9171\u53d1\u9001\u901a\u77e5\u8c03\u7528API\u5931\u8d25\uff01\uff01\n'), this.error(t)
						}).finally(() => {
							o()
						})
					}, s)
				} else o()
			})
		}
		pushPlusNotify(t, e) {
			return new Promise(s => {
				if (this.PUSH_PLUS_TOKEN) {
					e = e.replace(/[\n\r]/g, '<br>');
					const o = {
							token: `${this.PUSH_PLUS_TOKEN}`,
							title: `${t}`,
							content: `${e}`,
							topic: `${this.PUSH_PLUS_USER}`
						},
						i = {
							url: 'https://www.pushplus.plus/send',
							body: this.toStr(o),
							headers: {
								'Content-Type': ' application/json'
							},
							timeout: this.timeout
						};
					this.http.post(i).then(t => {
						const e = this.toObj(t.body);
						200 === e.code ? console.log(`push+\u53d1\u9001${this.PUSH_PLUS_USER?'\u4e00\u5bf9\u591a':'\u4e00\u5bf9\u4e00'}\u901a\u77e5\u6d88\u606f\u5b8c\u6210\u3002\n`) : console.log(`push+\u53d1\u9001${this.PUSH_PLUS_USER?'\u4e00\u5bf9\u591a':'\u4e00\u5bf9\u4e00'}\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff1a${e.msg}\n`)
					}).catch(t => {
						console.log(`push+\u53d1\u9001${this.PUSH_PLUS_USER?'\u4e00\u5bf9\u591a':'\u4e00\u5bf9\u4e00'}\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff01\uff01\n`), this.error(t)
					}).finally(() => {
						s()
					})
				} else s()
			})
		}
		BarkNotify(t, e, s = {}) {
			return new Promise(o => {
				if (this.BARK_PUSH) {
					const i = {
						url: `${this.BARK_PUSH}/${encodeURIComponent(t)}/${encodeURIComponent(e)}?sound=${this.BARK_SOUND}&group=${this.BARK_GROUP}&${this.querystring.stringify(s)}`,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						timeout: this.timeout
					};
					this.http.get(i).then(t => {
						const e = this.toObj(t.body);
						200 === e.code ? console.log('Bark APP\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\n') : console.log(`${e.message}\n`)
					}).catch(t => {
						console.log('Bark APP\u53d1\u9001\u901a\u77e5\u8c03\u7528API\u5931\u8d25\uff01\uff01\n'), this.error(t)
					}).finally(() => {
						o()
					})
				} else o()
			})
		}
		tgBotNotify(t, e) {
			return new Promise(s => {
				if (this.TG_BOT_TOKEN && this.TG_USER_ID) {
					const o = {
						url: `https://${this.TG_API_HOST}/bot${this.TG_BOT_TOKEN}/sendMessage`,
						body: `chat_id=${this.TG_USER_ID}&text=${t}\n\n${e}&disable_web_page_preview=true`,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						timeout: this.timeout
					};
					if (this.TG_PROXY_HOST && this.TG_PROXY_PORT) {
						const t = {
							host: this.TG_PROXY_HOST,
							port: 1 * this.TG_PROXY_PORT,
							proxyAuth: this.TG_PROXY_AUTH
						};
						Object.assign(o, {
							proxy: t
						})
					}
					this.http.post(o).then(t => {
						const e = this.toObj(t.body);
						e.ok ? console.log('Telegram\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\u3002\n') : 400 === e.error_code ? console.log('\u8bf7\u4e3b\u52a8\u7ed9bot\u53d1\u9001\u4e00\u6761\u6d88\u606f\u5e76\u68c0\u67e5\u63a5\u6536\u7528\u6237ID\u662f\u5426\u6b63\u786e\u3002\n') : 401 === e.error_code && console.log('Telegram bot token \u586b\u5199\u9519\u8bef\u3002\n')
					}).catch(t => {
						console.log('Telegram\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff01\uff01\n'), this.error(t)
					}).finally(() => {
						s()
					})
				} else s()
			})
		}
		ddBotNotify(t, e) {
			return new Promise(s => {
				const o = {
					url: `https://oapi.dingtalk.com/robot/send?access_token=${this.DD_BOT_TOKEN}`,
					json: {
						msgtype: 'text',
						text: {
							content: ` ${t}\n\n${e}`
						}
					},
					headers: {
						'Content-Type': 'application/json'
					},
					timeout: this.timeout
				};
				if (this.DD_BOT_TOKEN && this.DD_BOT_SECRET) {
					const t = require('crypto'),
						e = Date.now(),
						i = t.createHmac('sha256', this.DD_BOT_SECRET);
					i.update(`${e}\n${this.DD_BOT_SECRET}`);
					const n = encodeURIComponent(i.digest('base64'));
					o.url = `${o.url}&timestamp=${e}&sign=${n}`, this.http.post(o).then(t => {
						const e = this.toObj(t.body);
						0 === e.errcode ? console.log('\u9489\u9489\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\u3002\n') : console.log(`${e.errmsg}\n`)
					}).catch(t => {
						console.log('\u9489\u9489\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff01\uff01\n'), this.error(t)
					}).finally(() => {
						s()
					})
				} else this.DD_BOT_TOKEN ? this.http.post(o).then(t => {
					const e = this.toObj(t.body);
					0 === e.errcode ? console.log('\u9489\u9489\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5b8c\u6210\u3002\n') : console.log(`${e.errmsg}\n`)
				}).catch(t => {
					console.log('\u9489\u9489\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff01\uff01\n'), this.error(t)
				}).finally(() => {
					s()
				}) : s()
			})
		}
		qywxBotNotify(t, e) {
			return new Promise(s => {
				const o = {
					url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${this.QYWX_KEY}`,
					json: {
						msgtype: 'text',
						text: {
							content: ` ${t}\n\n${e}`
						}
					},
					headers: {
						'Content-Type': 'application/json'
					},
					timeout: this.timeout
				};
				this.QYWX_KEY ? this.http.post(o).then(t => {
					const e = this.toObj(t.body);
					0 === e.errcode ? console.log('\u4f01\u4e1a\u5fae\u4fe1\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\u3002\n') : console.log(`${e.errmsg}\n`)
				}).catch(t => {
					console.log('\u4f01\u4e1a\u5fae\u4fe1\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff01\uff01\n'), this.error(t)
				}).finally(() => {
					s()
				}) : s()
			})
		}
		ChangeUserId(t) {
			if (this.QYWX_AM_AY = this.QYWX_AM.split(','), this.QYWX_AM_AY[2]) {
				const e = this.QYWX_AM_AY[2].split('|');
				let s = '';
				for (let o = 0; o < e.length; o++) {
					const i = '\u7b7e\u5230\u53f7 ' + (o + 1);
					t.match(i) && (s = e[o])
				}
				return s || (s = this.QYWX_AM_AY[2]), s
			}
			return '@all'
		}
		qywxamNotify(t, e) {
			return new Promise(s => {
				if (this.QYWX_AM) {
					this.QYWX_AM_AY = this.QYWX_AM.split(',');
					const o = {
						url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
						json: {
							corpid: `${this.QYWX_AM_AY[0]}`,
							corpsecret: `${this.QYWX_AM_AY[1]}`
						},
						headers: {
							'Content-Type': 'application/json'
						},
						timeout: this.timeout
					};
					let i;
					this.http.post(o).then(s => {
						const o = e.replace(/\n/g, '<br/>'),
							n = this.toObj(s.body).access_token;
						switch (this.QYWX_AM_AY[4]) {
						case '0':
							i = {
								msgtype: 'textcard',
								textcard: {
									title: `${t}`,
									description: `${e}`,
									url: 'https://ooxx.be/js',
									btntxt: '\u66f4\u591a'
								}
							};
							break;
						case '1':
							i = {
								msgtype: 'text',
								text: {
									content: `${t}\n\n${e}`
								}
							};
							break;
						default:
							i = {
								msgtype: 'mpnews',
								mpnews: {
									articles: [{
										title: `${t}`,
										thumb_media_id: `${this.QYWX_AM_AY[4]}`,
										author: '\u667a\u80fd\u52a9\u624b',
										content_source_url: '',
										content: `${o}`,
										digest: `${e}`
									}]
								}
							}
						}
						this.QYWX_AM_AY[4] || (i = {
							msgtype: 'text',
							text: {
								content: `${t}\n\n${e}`
							}
						}), i = {
							url: `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${n}`,
							json: {
								touser: `${this.ChangeUserId(e)}`,
								agentid: `${this.QYWX_AM_AY[3]}`,
								safe: '0',
								...i
							},
							headers: {
								'Content-Type': 'application/json'
							}
						}
					}), this.http.post(i).then(t => {
						const s = this.toObj(s);
						0 === s.errcode ? console.log('\u6210\u5458ID:' + this.ChangeUserId(e) + '\u4f01\u4e1a\u5fae\u4fe1\u5e94\u7528\u6d88\u606f\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\u3002\n') : console.log(`${s.errmsg}\n`)
					}).catch(t => {
						console.log('\u6210\u5458ID:' + this.ChangeUserId(e) + '\u4f01\u4e1a\u5fae\u4fe1\u5e94\u7528\u6d88\u606f\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff01\uff01\n'), this.error(t)
					}).finally(() => {
						s()
					})
				} else s()
			})
		}
		iGotNotify(t, e, s = {}) {
			return new Promise(o => {
				if (this.IGOT_PUSH_KEY) {
					if (this.IGOT_PUSH_KEY_REGX = new RegExp('^[a-zA-Z0-9]{24}$'), !this.IGOT_PUSH_KEY_REGX.test(this.IGOT_PUSH_KEY)) return console.log('\u60a8\u6240\u63d0\u4f9b\u7684IGOT_PUSH_KEY\u65e0\u6548\n'), void o();
					const i = {
						url: `https://push.hellyw.com/${this.IGOT_PUSH_KEY.toLowerCase()}`,
						body: `title=${t}&content=${e}&${this.querystring.stringify(s)}`,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						timeout: this.timeout
					};
					this.http.post(i).then(t => {
						const e = this.toObj(t.body);
						0 === e.ret ? console.log('iGot\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\n') : console.log(`iGot\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5931\u8d25\uff1a${e.errMsg}\n`)
					}).catch(t => {
						console.log('iGot\u53d1\u9001\u901a\u77e5\u8c03\u7528API\u5931\u8d25\uff01\uff01\n'), this.error(t)
					}).finally(() => {
						o()
					})
				} else o()
			})
		}
		gobotNotify(t, e, s = 2100) {
			return new Promise(o => {
				if (this.GOBOT_URL) {
					const i = {
						url: `${this.GOBOT_URL}?access_token=${this.GOBOT_TOKEN}&${this.GOBOT_QQ}`,
						body: `message=${t}\n${e}`,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						timeout: this.timeout
					};
					setTimeout(() => {
						this.http.post(i).then(t => {
							const e = this.toObj(t.body);
							0 === e.retcode ? console.log('go-cqhttp\u53d1\u9001\u901a\u77e5\u6d88\u606f\u6210\u529f\ud83c\udf89\n') : 100 === e.retcode ? console.log(`go-cqhttp\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5f02\u5e38: ${e.errmsg}\n`) : console.log(`go-cqhttp\u53d1\u9001\u901a\u77e5\u6d88\u606f\u5f02\u5e38\n${this.toStr(e)}`)
						}).catch(t => {
							console.log('\u53d1\u9001go-cqhttp\u901a\u77e5\u8c03\u7528API\u5931\u8d25\uff01\uff01\n'), this.error(t)
						}).finally(() => {
							o()
						})
					}, s)
				} else o()
			})
		}
		log(t) {
			this.debug && console.log(`[${this.name}] LOG:\n${this.toStr(t)}`)
		}
		info(t) {
			console.log(`[${this.name}] INFO:\n${this.toStr(t)}`)
		}
		error(t) {
			console.log(`[${this.name}] ERROR:\n${this.toStr(t)}`)
		}
		wait(t) {
			return new Promise(e => setTimeout(e, t))
		}
		done(t = {}) {
			const e = ((new Date).getTime() - this.startTime) / 1e3;
			console.log(`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`), s || o || i ? $done(t) : n && 'undefined' != typeof $context && ($context.headers = t.headers, $context.statusCode = t.statusCode, $context.body = t.body)
		}
		toObj(t) {
			if ('object' == typeof t || t instanceof Object) return t;
			try {
				return JSON.parse(t)
			} catch (e) {
				return t
			}
		}
		toStr(t) {
			if ('string' == typeof t || t instanceof String) return t;
			try {
				return JSON.stringify(t)
			} catch (e) {
				return t
			}
		}
	}(t, e)
}
/*****************************************************************************/
