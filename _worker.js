
let 快速订阅访问入口= ['auto'];
let addresses = [
	atob('aWNvb2sudHc6MjA1MyPlrpjmlrnkvJjpgInln5/lkI0='),
];

let addressesapi = [];
let addressesnotls = [

];
let addressesnotlsapi = [];

let DLS = 7;
let addressescsv = [];

let subconverter = 'SUBAPI.fxxk.dedyn.io';
let subconfig = atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2NtbGl1L0FDTDRTU1IvbWFpbi9DbGFzaC9jb25maWcvQUNMNFNTUl9PbmxpbmVfRnVsbF9NdWx0aU1vZGUuaW5p');
let noTLS = 'false';
let link;
let 隧道版本作者 = atob('ZWQ=');
let 获取代理IP = 'false';
let proxyIPs = [
	atob('cHJveHlpcC5meHhrLmRlZHluLmlv'),
];
let 匹配PROXYIP = []
let socks5DataURL = '';
let BotToken ='';
let ChatID =''; 
let 临时中转域名 = [];
let 临时中转域名接口 = '';
let EndPS = '';
let 协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
let FileName = '优选订阅生成器';
let SUBUpdateTime = 6; 
let total = 99;
let timestamp = 4102329600000;
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
let fakeUserID ;
let fakeHostName ;
let httpsPorts = ["2053","2083","2087","2096","8443"];
let effectiveTime = 7;
let updateTime = 3;
let MamaJustKilledAMan = ['telegram','twitter','miaoko'];
let proxyIPPool = [];
let socks5Data;

async function 整理优选列表(api) {
	if (!api || api.length === 0) return [];

	let newapi = "";

	// 创建一个AbortController对象，用于控制fetch请求的取消
	const controller = new AbortController();

	const timeout = setTimeout(() => {
		controller.abort(); // 取消所有请求
	}, 2000); // 2秒后触发

	try {
		// 使用Promise.allSettled等待所有API请求完成，无论成功或失败
		// 对api数组进行遍历，对每个API地址发起fetch请求
		const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
			method: 'get', 
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': FileName + atob('IGNtbGl1L1dvcmtlclZsZXNzMnN1Yg==')
			},
			signal: controller.signal // 将AbortController的信号量添加到fetch请求中，以便于需要时可以取消请求
		}).then(response => response.ok ? response.text() : Promise.reject())));

		// 遍历所有响应
		for (const [index, response] of responses.entries()) {
			// 检查响应状态是否为'fulfilled'，即请求成功完成
			if (response.status === 'fulfilled') {
				// 获取响应的内容
				const content = await response.value;

				// 验证当前apiUrl是否带有'proxyip=true'
				if (api[index].includes('proxyip=true')) {
					// 如果URL带有'proxyip=true'，则将内容添加到proxyIPPool
					proxyIPPool = proxyIPPool.concat((await 整理(content)).map(item => {
						const baseItem = item.split('#')[0] || item;
						if (baseItem.includes(':')) {
							const port = baseItem.split(':')[1];
							if (!httpsPorts.includes(port)) {
								return baseItem;
							}
						} else {
							return `${baseItem}:443`;
						}
						return null; // 不符合条件时返回 null
					}).filter(Boolean)); // 过滤掉 null 值
				}
				// 将内容添加到newapi中
				newapi += content + '\n';
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		// 无论成功或失败，最后都清除设置的超时定时器
		clearTimeout(timeout);
	}

	const newAddressesapi = await 整理(newapi);

	// 返回处理后的结果
	return newAddressesapi;
}

async function 整理测速结果(tls) {
    // 参数验证
    if (!tls) {
        console.error('TLS参数不能为空');
        return [];
    }

    // 检查CSV地址列表
    if (!Array.isArray(addressescsv) || addressescsv.length === 0) {
        console.warn('没有可用的CSV地址列表');
        return [];
    }

    // CSV解析函数
    function parseCSV(text) {
        return text
            .replace(/\r\n/g, '\n')   // 统一Windows换行
            .replace(/\r/g, '\n')     // 处理老Mac换行
            .split('\n')               // 按Unix/Linux风格分割
            .filter(line => line.trim() !== '')  // 移除空行
            .map(line => line.split(',').map(cell => cell.trim()));
    }

    // 并行处理CSV
    const csvPromises = addressescsv.map(async (csvUrl) => {
        try {
            const response = await fetch(csvUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP错误 ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            const rows = parseCSV(text);
            
            // 解构和验证CSV头部
            const [header, ...dataRows] = rows;
            const tlsIndex = header.findIndex(col => col.toUpperCase() === 'TLS');
            
            if (tlsIndex === -1) {
                throw new Error('CSV文件缺少必需的字段');
            }
            
            return dataRows
                .filter(row => {
                    const tlsValue = row[tlsIndex].toUpperCase();
                    const speed = parseFloat(row[row.length - 1]);
                    return tlsValue === tls.toUpperCase() && speed > DLS;
                })
                .map(row => {
                    const ipAddress = row[0];
                    const port = row[1];
                    const dataCenter = row[tlsIndex + 1];
                    const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
                    
                    // 处理代理IP池
                    if (csvUrl.includes('proxyip=true') && 
                        row[tlsIndex].toUpperCase() === 'TRUE' && 
                        !httpsPorts.includes(port)) {
                        proxyIPPool.push(`${ipAddress}:${port}`);
                    }
                    
                    return formattedAddress;
                });
        } catch (error) {
            console.error(`处理CSV ${csvUrl} 时出错:`, error);
            return [];
        }
    });
    
    // 使用Promise.all并行处理并展平结果
    const results = await Promise.all(csvPromises);
    return results.flat();
}

async function 整理(内容) {
    // 将制表符、双引号、单引号和换行符都替换为逗号
    // 然后将连续的多个逗号替换为单个逗号
    var 替换后的内容 = 内容.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');
    
    // 删除开头和结尾的逗号（如果有的话）
    if (替换后的内容.charAt(0) == ',') 替换后的内容 = 替换后的内容.slice(1);
    if (替换后的内容.charAt(替换后的内容.length - 1) == ',') 替换后的内容 = 替换后的内容.slice(0, 替换后的内容.length - 1);
    
    // 使用逗号分割字符串，得到地址数组
    const 地址数组 = 替换后的内容.split(',');
    
    return 地址数组;
}

async function sendMessage(type, ip, add_data = "") {
    if (!BotToken || !ChatID) return;

    try {
        let msg = "";
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
        if (response.ok) {
            const ipInfo = await response.json();
            msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
        } else {
            msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
        }

        const url = `https://api.telegram.org/bot${BotToken}/sendMessage?chat_id=${ChatID}&parse_mode=HTML&text=${encodeURIComponent(msg)}`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function nginx() {
	const text = `
	<!DOCTYPE html>
	<html>
	<head>
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>
	
	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
	return text ;
}

function surge(content, url) {
	let 每行内容;
	if (content.includes('\r\n')){
		每行内容 = content.split('\r\n');
	} else {
		每行内容 = content.split('\n');
	}

	let 输出内容 = "";
	for (let x of 每行内容) {
		if (x.includes('= trojan,')) {
			const host = x.split("sni=")[1].split(",")[0];
			const 备改内容 = `skip-cert-verify=true, tfo=false, udp-relay=false`;
			const 正确内容 = `skip-cert-verify=true, ws=true, ws-path=/?ed=2560, ws-headers=Host:"${host}", tfo=false, udp-relay=false`;
			输出内容 += x.replace(new RegExp(备改内容, 'g'), 正确内容).replace("[", "").replace("]", "") + '\n';
		} else {
			输出内容 += x + '\n';
		}
	}

	输出内容 = `#!MANAGED-CONFIG ${url.href} interval=86400 strict=false` + 输出内容.substring(输出内容.indexOf('\n'));
	return 输出内容;
}

function getRandomProxyByMatch(CC, socks5Data) {
	// 将匹配字符串转换为小写
	const lowerCaseMatch = CC.toLowerCase();
	
	// 过滤出所有以指定匹配字符串结尾的代理字符串
	let filteredProxies = socks5Data.filter(proxy => proxy.toLowerCase().endsWith(`#${lowerCaseMatch}`));
	
	// 如果没有匹配的代理，尝试匹配 "US"
	if (filteredProxies.length === 0) {
		filteredProxies = socks5Data.filter(proxy => proxy.toLowerCase().endsWith(`#us`));
	}
	
	// 如果还是没有匹配的代理，从整个代理列表中随机选择一个
	if (filteredProxies.length === 0) {
		return socks5Data[Math.floor(Math.random() * socks5Data.length)];
	}
	
	// 从匹配的代理中随机选择一个并返回
	const randomProxy = filteredProxies[Math.floor(Math.random() * filteredProxies.length)];
	return randomProxy;
}

async function MD5MD5(text) {
	const encoder = new TextEncoder();
  
	const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
	const firstPassArray = Array.from(new Uint8Array(firstPass));
	const firstHex = firstPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

	const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
	const secondPassArray = Array.from(new Uint8Array(secondPass));
	const secondHex = secondPassArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
	return secondHex.toLowerCase();
}

function revertFakeInfo(content, userID, hostName) {
	content = content.replace(new RegExp(fakeUserID, 'g'), userID).replace(new RegExp(fakeHostName, 'g'), hostName);
	return content;
}

function generateFakeInfo(content, userID, hostName) {
	content = content.replace(new RegExp(userID, 'g'), fakeUserID).replace(new RegExp(hostName, 'g'), fakeHostName);
	return content;
}

function isValidIPv4(address) {
	const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return ipv4Regex.test(address);
}

function generateDynamicUUID(key) {
    function getWeekOfYear() {
        const now = new Date();
        const timezoneOffset = 8; // 北京时间相对于UTC的时区偏移+8小时
        const adjustedNow = new Date(now.getTime() + timezoneOffset * 60 * 60 * 1000);
        const start = new Date(2007, 6, 7, updateTime, 0, 0); // 固定起始日期为2007年7月7日的凌晨3点
        const diff = adjustedNow - start;
        const oneWeek = 1000 * 60 * 60 * 24 * effectiveTime;
        return Math.ceil(diff / oneWeek);
    }
    
    const passwdTime = getWeekOfYear(); // 获取当前周数
    const endTime = new Date(2007, 6, 7, updateTime, 0, 0); // 固定起始日期
    endTime.setMilliseconds(endTime.getMilliseconds() + passwdTime * 1000 * 60 * 60 * 24 * effectiveTime);

    // 生成 UUID 的辅助函数
    function generateUUID(baseString) {
        const hashBuffer = new TextEncoder().encode(baseString);
        return crypto.subtle.digest('SHA-256', hashBuffer).then((hash) => {
            const hashArray = Array.from(new Uint8Array(hash));
            const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            let uuid = hexHash.substr(0, 8) + '-' + hexHash.substr(8, 4) + '-4' + hexHash.substr(13, 3) + '-' + (parseInt(hexHash.substr(16, 2), 16) & 0x3f | 0x80).toString(16) + hexHash.substr(18, 2) + '-' + hexHash.substr(20, 12);
            return uuid;
        });
    }
    
    // 生成两个 UUID
    const currentUUIDPromise = generateUUID(key + passwdTime);
    const previousUUIDPromise = generateUUID(key + (passwdTime - 1));

    // 格式化到期时间
    const expirationDateUTC = new Date(endTime.getTime() - 8 * 60 * 60 * 1000); // UTC时间
    const expirationDateString = `到期时间(UTC): ${expirationDateUTC.toISOString().slice(0, 19).replace('T', ' ')} (UTC+8): ${endTime.toISOString().slice(0, 19).replace('T', ' ')}\n`;

    return Promise.all([currentUUIDPromise, previousUUIDPromise, expirationDateString]);
}

async function getLink(重新汇总所有链接) {
	let 节点LINK = [];
	let 订阅链接 = [];
	for (let x of 重新汇总所有链接) {
		if (x.toLowerCase().startsWith('http')) {
			订阅链接.push(x);
		} else {
			节点LINK.push(x);
		}
	}

	if ( 订阅链接 && 订阅链接.length !== 0 ) {
		function base64Decode(str) {
			const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
			const decoder = new TextDecoder('utf-8');
			return decoder.decode(bytes);
		}
		const controller = new AbortController(); // 创建一个AbortController实例，用于取消请求
	
		const timeout = setTimeout(() => {
			controller.abort(); // 2秒后取消所有请求
		}, 2000);
		
		try {
			// 使用Promise.allSettled等待所有API请求完成，无论成功或失败
			const responses = await Promise.allSettled(订阅链接.map(apiUrl => fetch(apiUrl, {
				method: 'get', 
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;',
					'User-Agent': `\u0076\u0032\u0072\u0061\u0079\u004e\u002f${FileName + atob('IGNtbGl1L1dvcmtlclZsZXNzMnN1Yg==')}`
				},
				signal: controller.signal // 将AbortController的信号量添加到fetch请求中
			}).then(response => response.ok ? response.text() : Promise.reject())));
		
			// 遍历所有响应
			const modifiedResponses = responses.map((response, index) => {
				// 检查是否请求成功
				return {
					status: response.status,
					value: response.value,
					apiUrl: 订阅链接[index] // 将原始的apiUrl添加到返回对象中
				};
			});
		
			console.log(modifiedResponses); // 输出修改后的响应数组
		
			for (const response of modifiedResponses) {
				// 检查响应状态是否为'fulfilled'
				if (response.status === 'fulfilled') {
					const content = await response.value || 'null'; // 获取响应的内容
					if (content.includes('://')) {
						const lines = content.includes('\r\n') ? content.split('\r\n') : content.split('\n');
						节点LINK = 节点LINK.concat(lines);
					} else {
						const 尝试base64解码内容 = base64Decode(content);
						if (尝试base64解码内容.includes('://')) {
							const lines = 尝试base64解码内容.includes('\r\n') ? 尝试base64解码内容.split('\r\n') : 尝试base64解码内容.split('\n');
							节点LINK = 节点LINK.concat(lines);
						}
					}
				}
			}
		} catch (error) {
			console.error(error); // 捕获并输出错误信息
		} finally {
			clearTimeout(timeout); // 清除定时器
		}
	}

	return 节点LINK;
}

export default {
	async fetch (request, env) {
		if (env.TOKEN) 快速订阅访问入口 = await 整理(env.TOKEN);
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID; 
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;
		FileName = env.SUBNAME || FileName;
		socks5DataURL = env.SOCKS5DATA || socks5DataURL;
		if (env.CMPROXYIPS) 匹配PROXYIP = await 整理(env.CMPROXYIPS);;
		if (env.CFPORTS) httpsPorts = await 整理(env.CFPORTS);
		EndPS = env.PS || EndPS;
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);
		const format = url.searchParams.get('format') ? url.searchParams.get('format').toLowerCase() : "null";
		let host = "";
		let uuid = "";
		let path = "";
		let sni = "";
		let type = "ws";
		let UD = Math.floor(((timestamp - Date.now())/timestamp * 99 * 1099511627776 * 1024)/2);
		if (env.UA) MamaJustKilledAMan = MamaJustKilledAMan.concat(await 整理(env.UA));

		const currentDate = new Date();
		const fakeUserIDMD5 = await MD5MD5(Math.ceil(currentDate.getTime()));
		fakeUserID = fakeUserIDMD5.slice(0, 8) + "-" + fakeUserIDMD5.slice(8, 12) + "-" + fakeUserIDMD5.slice(12, 16) + "-" + fakeUserIDMD5.slice(16, 20) + "-" + fakeUserIDMD5.slice(20);
		fakeHostName = fakeUserIDMD5.slice(6, 9) + "." + fakeUserIDMD5.slice(13, 19) + ".xyz";

		total = total * 1099511627776 * 1024;
		let expire= Math.floor(timestamp / 1000) ;

		link = env.LINK || link;
		
		if (env.ADD) addresses = await 整理(env.ADD);
		if (env.ADDAPI) addressesapi = await 整理(env.ADDAPI);
		if (env.ADDNOTLS) addressesnotls = await 整理(env.ADDNOTLS);
		if (env.ADDNOTLSAPI) addressesnotlsapi = await 整理(env.ADDNOTLSAPI);
		if (env.ADDCSV) addressescsv = await 整理(env.ADDCSV);
		DLS = env.DLS || DLS;
		
		if (socks5DataURL) {
			try {
				const response = await fetch(socks5DataURL);
				const socks5DataText = await response.text();
				if (socks5DataText.includes('\r\n')){
					socks5Data = socks5DataText.split('\r\n').filter(line => line.trim() !== '');
				} else {
					socks5Data = socks5DataText.split('\n').filter(line => line.trim() !== '');
				}
			} catch {
				socks5Data = null ;
			}
		}
		
		if (env.PROXYIP) proxyIPs = await 整理(env.PROXYIP);
		//console.log(proxyIPs);

		if (快速订阅访问入口.length > 0 && 快速订阅访问入口.some(token => url.pathname.includes(token))) {
			host = "null";
			if (env.HOST) {
				const hosts = await 整理(env.HOST);
				host = hosts[Math.floor(Math.random() * hosts.length)];
			}
			
			if (env.PASSWORD){
				协议类型 = 'Trojan';
				uuid = env.PASSWORD
			} else {
				协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
				if (env.KEY) {
					effectiveTime = env.TIME || effectiveTime;
					updateTime = env.UPTIME || updateTime;
					const userIDs = await generateDynamicUUID(env.KEY);
					uuid = userIDs[0];
				} else {
					uuid = env.UUID || "null";
				}
			}
			
			path = env.PATH || "/?ed=2560";
			sni = env.SNI || host;
			type = env.TYPE || type;
			隧道版本作者 = env.ED || 隧道版本作者;
			获取代理IP = env.RPROXYIP || 获取代理IP;

			if (host == "null" || uuid == "null" ){
				let 空字段;
				if (host == "null" && uuid == "null") 空字段 = "HOST/UUID";
				else if (host == "null") 空字段 = "HOST";
				else if (uuid == "null") 空字段 = "UUID";
				EndPS += ` 订阅器内置节点 ${空字段} 未设置！！！`;
			}

		await sendMessage(`#${FileName}订阅`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgentHeader}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
		} else {
			host = url.searchParams.get('host');
			uuid = url.searchParams.get('uuid') || url.searchParams.get('password') || url.searchParams.get('pw');
			path = url.searchParams.get('path');
			sni = url.searchParams.get('sni') || host;
			type = url.searchParams.get('type') || type;
			隧道版本作者 = url.searchParams.get(atob('ZWRnZXR1bm5lbA==')) || url.searchParams.get('epeius') || 隧道版本作者;
			获取代理IP = url.searchParams.get('proxyip') || 获取代理IP;

			if (url.searchParams.has(atob('ZWRnZXR1bm5lbA==')) || url.searchParams.has('uuid')){
				协议类型 = atob('VkxFU1M=');
			} else if (url.searchParams.has('epeius') || url.searchParams.has('password') || url.searchParams.has('pw')){
				协议类型 = 'Trojan';
			}

			if (!url.pathname.includes("/sub")) {
				const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
				if (envKey) {
					const URLs = await 整理(env[envKey]);
					const URL = URLs[Math.floor(Math.random() * URLs.length)];
					return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
				}
				//首页改成一个nginx伪装页
				return new Response(await nginx(), {
					headers: {
						'Content-Type': 'text/html; charset=UTF-8',
					},
				});
			}
			
			if (!host || !uuid) {
				const responseText = `
			缺少必填参数：host 和 uuid
			Missing required parameters: host and uuid
			پارامترهای ضروری وارد نشده: هاست و یوآی‌دی
			
			${url.origin}/sub?host=[your host]&uuid=[your uuid]&path=[your path]
			
			
			
			
			
			
				
				${atob('aHR0cHM6Ly9naXRodWIuY29tL2NtbGl1L3dvcmtlclZsZXNzMnN1Yg==')}
				`;
			
				return new Response(responseText, {
				status: 202,
				headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			}
			
			if (!path || path.trim() === '') {
				path = '/?ed=2560';
			} else {
				// 如果第一个字符不是斜杠，则在前面添加一个斜杠
				path = (path[0] === '/') ? path : '/' + path;
			}
		}
		
		if (host.toLowerCase().includes('notls') || host.toLowerCase().includes('worker') || host.toLowerCase().includes('trycloudflare')) noTLS = 'true';
		noTLS = env.NOTLS || noTLS;
		let subconverterUrl = generateFakeInfo(url.href, uuid, host);

		if (!userAgent.includes('subconverter') && MamaJustKilledAMan.some(PutAGunAgainstHisHeadPulledMyTriggerNowHesDead => userAgent.includes(PutAGunAgainstHisHeadPulledMyTriggerNowHesDead)) && MamaJustKilledAMan.length > 0) {
			const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
			if (envKey) {
				const URLs = await 整理(env[envKey]);
				const URL = URLs[Math.floor(Math.random() * URLs.length)];
				return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
			}
			//首页改成一个nginx伪装页
			return new Response(await nginx(), {
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				},
			});
		} else if ( (userAgent.includes('clash') || (format === 'clash' && !userAgent.includes('subconverter')) ) && !userAgent.includes('nekobox') && !userAgent.includes('cf-workers-sub')) {
			subconverterUrl = `https://${subconverter}/sub?target=clash&url=${encodeURIComponent(subconverterUrl)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
		} else if ( (userAgent.includes('sing-box') || userAgent.includes('singbox') || (format === 'singbox' && !userAgent.includes('subconverter')) ) && !userAgent.includes('cf-workers-sub')){
			subconverterUrl = `https://${subconverter}/sub?target=singbox&url=${encodeURIComponent(subconverterUrl)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
		} else {
			if(host.includes('workers.dev')) {
				if (临时中转域名接口) {
					try {
						const response = await fetch(临时中转域名接口); 
					
						if (!response.ok) {
							console.error('获取地址时出错:', response.status, response.statusText);
							return; // 如果有错误，直接返回
						}
					
						const text = await response.text();
						const lines = text.split('\n');
						// 过滤掉空行或只包含空白字符的行
						const nonEmptyLines = lines.filter(line => line.trim() !== '');
					
						临时中转域名 = 临时中转域名.concat(nonEmptyLines);
					} catch (error) {
						console.error('获取地址时出错:', error);
					}
				}
				// 使用Set对象去重
				临时中转域名 = [...new Set(临时中转域名)];
			}
			
			const newAddressesapi = await 整理优选列表(addressesapi);
			const newAddressescsv = await 整理测速结果('TRUE');
			addresses = addresses.concat(newAddressesapi);
			addresses = addresses.concat(newAddressescsv);
			
			// 使用Set对象去重
			const uniqueAddresses = [...new Set(addresses)];
			
			let notlsresponseBody;
			if(noTLS == 'true' && 协议类型 == atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`)){
				const newAddressesnotlsapi = await 整理优选列表(addressesnotlsapi);
				const newAddressesnotlscsv = await 整理测速结果('FALSE');
				addressesnotls = addressesnotls.concat(newAddressesnotlsapi);
				addressesnotls = addressesnotls.concat(newAddressesnotlscsv);
				const uniqueAddressesnotls = [...new Set(addressesnotls)];

				notlsresponseBody = uniqueAddressesnotls.map(address => {
					let port = "-1";
					let addressid = address;
				
					const match = addressid.match(regex);
					if (!match) {
						if (address.includes(':') && address.includes('#')) {
							const parts = address.split(':');
							address = parts[0];
							const subParts = parts[1].split('#');
							port = subParts[0];
							addressid = subParts[1];
						} else if (address.includes(':')) {
							const parts = address.split(':');
							address = parts[0];
							port = parts[1];
						} else if (address.includes('#')) {
							const parts = address.split('#');
							address = parts[0];
							addressid = parts[1];
						}
					
						if (addressid.includes(':')) {
							addressid = addressid.split(':')[0];
						}
					} else {
						address = match[1];
						port = match[2] || port;
						addressid = match[3] || address;
					}

					const httpPorts = ["8080","8880","2052","2082","2086","2095"];
					if (!isValidIPv4(address) && port == "-1") {
						for (let httpPort of httpPorts) {
							if (address.includes(httpPort)) {
								port = httpPort;
								break;
							}
						}
					}
					if (port == "-1") port = "80";
					//console.log(address, port, addressid);

					if (隧道版本作者.trim() === atob('Y21saXU=') && 获取代理IP.trim() === 'true') {
						// 将addressid转换为小写
						let lowerAddressid = addressid.toLowerCase();
						// 初始化找到的proxyIP为null
						let foundProxyIP = null;
					
						if (socks5Data) {
							const socks5 = getRandomProxyByMatch(lowerAddressid, socks5Data);
							path = `/${socks5}`;
						} else {
							// 遍历匹配PROXYIP数组查找匹配项
							for (let item of 匹配PROXYIP) {
								if ( item.includes('#') && item.split('#')[1] && lowerAddressid.includes(item.split('#')[1].toLowerCase())) {
									foundProxyIP = item.split('#')[0];
									break; // 找到匹配项，跳出循环
								} else if ( item.includes(':') && item.split(':')[1] && lowerAddressid.includes(item.split(':')[1].toLowerCase())) {
									foundProxyIP = item.split(':')[0];
									break; // 找到匹配项，跳出循环
								}
							}
						
							if (foundProxyIP) {
								// 如果找到匹配的proxyIP，赋值给path
								path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + foundProxyIP;
							} else {
								// 如果没有找到匹配项，随机选择一个proxyIP
								const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
								path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + randomProxyIP;
							}
						}
					}

					const 维列斯Link = `${atob('dmxlc3M6Ly8=') + uuid}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT0mdHlwZT0=') + type}&host=${host}&path=${encodeURIComponent(path)}#${encodeURIComponent(addressid + EndPS)}`;
			
					return 维列斯Link;

				}).join('\n');
			}

			const responseBody = uniqueAddresses.map(address => {
				let port = "-1";
				let addressid = address;
			
				const match = addressid.match(regex);
				if (!match) {
					if (address.includes(':') && address.includes('#')) {
						const parts = address.split(':');
						address = parts[0];
						const subParts = parts[1].split('#');
						port = subParts[0];
						addressid = subParts[1];
					} else if (address.includes(':')) {
						const parts = address.split(':');
						address = parts[0];
						port = parts[1];
					} else if (address.includes('#')) {
						const parts = address.split('#');
						address = parts[0];
						addressid = parts[1];
					}
				
					if (addressid.includes(':')) {
						addressid = addressid.split(':')[0];
					}
				} else {
					address = match[1];
					port = match[2] || port;
					addressid = match[3] || address;
				}

				if (!isValidIPv4(address) && port == "-1") {
					for (let httpsPort of httpsPorts) {
						if (address.includes(httpsPort)) {
							port = httpsPort;
							break;
						}
					}
				}
				if (port == "-1") port = "443";
				
				//console.log(address, port, addressid);
		
				if (隧道版本作者.trim() === atob('Y21saXU=') && 获取代理IP.trim() === 'true') {
					// 将addressid转换为小写
					let lowerAddressid = addressid.toLowerCase();
					// 初始化找到的proxyIP为null
					let foundProxyIP = null;
				
					if (socks5Data) {
						const socks5 = getRandomProxyByMatch(lowerAddressid, socks5Data);
						path = `/${socks5}`;
					} else {
						// 遍历匹配PROXYIP数组查找匹配项
						for (let item of 匹配PROXYIP) {
							if ( item.includes('#') && item.split('#')[1] && lowerAddressid.includes(item.split('#')[1].toLowerCase())) {
								foundProxyIP = item.split('#')[0];
								break; // 找到匹配项，跳出循环
							} else if ( item.includes(':') && item.split(':')[1] && lowerAddressid.includes(item.split(':')[1].toLowerCase())) {
								foundProxyIP = item.split(':')[0];
								break; // 找到匹配项，跳出循环
							}
						}
						
						const matchingProxyIP = proxyIPPool.find(proxyIP => proxyIP.includes(address));
						if (matchingProxyIP) {
							path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + matchingProxyIP;
						} else if (foundProxyIP) {
							// 如果找到匹配的proxyIP，赋值给path
							path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + foundProxyIP;
						} else {
							// 如果没有找到匹配项，随机选择一个proxyIP
							const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
							path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + randomProxyIP;
						}
					}
				}
				
				let 伪装域名 = host ;
				let 最终路径 = path ;
				let 节点备注 = EndPS ;
				if(临时中转域名.length > 0 && (host.includes('.workers.dev'))) {
					最终路径 = `/${host}${path}`;
					伪装域名 = 临时中转域名[Math.floor(Math.random() * 临时中转域名.length)];
					节点备注 = EndPS + atob('IOW3suWQr+eUqOS4tOaXtuWfn+WQjeS4rei9rOacjeWKoe+8jOivt+WwveW/q+e7keWumuiHquWumuS5ieWfn++8gQ==');
					sni = 伪装域名;
				}

				if (协议类型 == 'Trojan'){
					const trojanLink = `${atob('dHJvamFuOi8v') + uuid}@${address}:${port + atob('P3NlY3VyaXR5PXRscyZzbmk9') + sni + atob('JmFscG49aHR0cCUyRjEuMSZmcD1yYW5kb21pemVkJnR5cGU9') + type}&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;
					return trojanLink;
				} else {
					const 维列斯Link = `${atob('dmxlc3M6Ly8=') + uuid}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT10bHMmc25pPQ==') + sni + atob('JmFscG49aHR0cCUyRjEuMSZmcD1yYW5kb20mdHlwZT0=') + type}&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;
					return 维列斯Link;
				}

			}).join('\n');
			
			let combinedContent = responseBody; // 合并内容
			
			if (link) {
				const links = await 整理(link);
				const 整理节点LINK = (await getLink(links)).join('\n');
				combinedContent += '\n' + 整理节点LINK;
				console.log("link: " + 整理节点LINK)
			}
			
			if (notlsresponseBody && noTLS == 'true') {
				combinedContent += '\n' + notlsresponseBody;
				console.log("notlsresponseBody: " + notlsresponseBody);
			}
			
			if (协议类型 == 'Trojan' && (userAgent.includes('surge') || (format === 'surge' && !userAgent.includes('subconverter')) ) && !userAgent.includes('cf-workers-sub')) {
				const TrojanLinks = combinedContent.split('\n');
				const TrojanLinksJ8 = generateFakeInfo(TrojanLinks.join('|'), uuid, host);
				subconverterUrl =  `https://${subconverter}/sub?target=surge&ver=4&url=${encodeURIComponent(TrojanLinksJ8)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=true&fdn=false`;
			} else {

				let base64Response;
				try {
					base64Response = btoa(combinedContent); // 重新进行 Base64 编码
				} catch (e) {
					function encodeBase64(data) {
						const binary = new TextEncoder().encode(data);
						let base64 = '';
						const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
					
						for (let i = 0; i < binary.length; i += 3) {
							const byte1 = binary[i];
							const byte2 = binary[i + 1] || 0;
							const byte3 = binary[i + 2] || 0;
					
							base64 += chars[byte1 >> 2];
							base64 += chars[((byte1 & 3) << 4) | (byte2 >> 4)];
							base64 += chars[((byte2 & 15) << 2) | (byte3 >> 6)];
							base64 += chars[byte3 & 63];
						}
					
						const padding = 3 - (binary.length % 3 || 3);
						return base64.slice(0, base64.length - padding) + '=='.slice(0, padding);
					}
					
					base64Response = encodeBase64(combinedContent);
				}

				const response = new Response(base64Response, {
					headers: { 
						//"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
						"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
					},
				});
	
				return response;
			}

		}

		try {
			const subconverterResponse = await fetch(subconverterUrl);
			
			if (!subconverterResponse.ok) {
				throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
			}
				
			let subconverterContent = await subconverterResponse.text();

			if (协议类型 == 'Trojan' && (userAgent.includes('surge') || (format === 'surge' && !userAgent.includes('subconverter')) ) && !userAgent.includes('cf-workers-sub')){
				subconverterContent = surge(subconverterContent, host);
			}
			subconverterContent = revertFakeInfo(subconverterContent, uuid, host);
			return new Response(subconverterContent, {
				headers: { 
					"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
					"content-type": "text/plain; charset=utf-8",
					"Profile-Update-Interval": `${SUBUpdateTime}`,
					"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
				},
			});
		} catch (error) {
			return new Response(`Error: ${error.message}`, {
				status: 500,
				headers: { 'content-type': 'text/plain; charset=utf-8' },
			});
		}
	}
};