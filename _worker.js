
let 快速订阅访问入口 = ['auto'];
let addresses = [];
let addressesapi = [];

let addressesnotls = [];
let addressesnotlsapi = [];

let addressescsv = [];
let DLS = 7;
let remarkIndex = 1;//CSV备注所在列偏移量

let subConverter = 'SUBAPI.cmliussss.net';
let subConfig = atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2NtbGl1L0FDTDRTU1IvbWFpbi9DbGFzaC9jb25maWcvQUNMNFNTUl9PbmxpbmVfRnVsbF9NdWx0aU1vZGUuaW5p');
let noTLS = 'false';
let link;
let 隧道版本作者 = atob('ZWQ=');
let 获取代理IP;
let proxyIPs = [
	atob('cHJveHlpcC5meHhrLmRlZHluLmlv'),
];
let 匹配PROXYIP = []
let socks5DataURL = '';
let BotToken = '';
let ChatID = '';
let 临时中转域名 = [];
let 临时中转域名接口 = '';
let EndPS = '';
let 协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
let FileName = '优选订阅生成器';
let SUBUpdateTime = 6;
let total = 24;
let timestamp = 4102329600000;
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
let fakeUserID;
let fakeHostName;
let httpsPorts = ["2053", "2083", "2087", "2096", "8443"];
let 有效时间 = 7;
let 更新时间 = 3;
let MamaJustKilledAMan = ['telegram', 'twitter', 'miaoko'];
let proxyIPPool = [];
let socks5Data;
let alpn = 'h3';
let 网络备案 = `<a href='https://t.me/CMLiussss'>萌ICP备-20240707号</a>`;//写你自己的维护者广告
let 额外ID = '0';
let 加密方式 = 'auto';
let 网站图标, 网站头像, 网站背景, xhttp = '';
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

				const lines = content.split(/\r?\n/);
				let 节点备注 = '';
				let 测速端口 = '443';

				if (lines[0].split(',').length > 3) {
					const idMatch = api[index].match(/id=([^&]*)/);
					if (idMatch) 节点备注 = idMatch[1];

					const portMatch = api[index].match(/port=([^&]*)/);
					if (portMatch) 测速端口 = portMatch[1];

					for (let i = 1; i < lines.length; i++) {
						const columns = lines[i].split(',')[0];
						if (columns) {
							newapi += `${columns}:${测速端口}${节点备注 ? `#${节点备注}` : ''}\n`;
							if (api[index].includes('proxyip=true')) proxyIPPool.push(`${columns}:${测速端口}`);
						}
					}
				} else {
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
			.replace(/\r/g, '\n')	 // 处理老Mac换行
			.split('\n')			   // 按Unix/Linux风格分割
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
					const dataCenter = row[tlsIndex + remarkIndex];
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
	return text;
}

function surge(content, url, path) {
	let 每行内容;
	if (content.includes('\r\n')) {
		每行内容 = content.split('\r\n');
	} else {
		每行内容 = content.split('\n');
	}

	let 输出内容 = "";
	for (let x of 每行内容) {
		if (x.includes(atob('PSB0cm9qYW4s'))) {
			const host = x.split("sni=")[1].split(",")[0];
			const 备改内容 = `skip-cert-verify=true, tfo=false, udp-relay=false`;
			const 正确内容 = `skip-cert-verify=true, ws=true, ws-path=${path}, ws-headers=Host:"${host}", tfo=false, udp-relay=false`;
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

function 生成动态UUID(密钥) {
	const 时区偏移 = 8; // 北京时间相对于UTC的时区偏移+8小时
	const 起始日期 = new Date(2007, 6, 7, 更新时间, 0, 0); // 固定起始日期为2007年7月7日的凌晨3点
	const 一周的毫秒数 = 1000 * 60 * 60 * 24 * 有效时间;

	function 获取当前周数() {
		const 现在 = new Date();
		const 调整后的现在 = new Date(现在.getTime() + 时区偏移 * 60 * 60 * 1000);
		const 时间差 = Number(调整后的现在) - Number(起始日期);
		return Math.ceil(时间差 / 一周的毫秒数);
	}

	function 生成UUID(基础字符串) {
		const 哈希缓冲区 = new TextEncoder().encode(基础字符串);
		return crypto.subtle.digest('SHA-256', 哈希缓冲区).then((哈希) => {
			const 哈希数组 = Array.from(new Uint8Array(哈希));
			const 十六进制哈希 = 哈希数组.map(b => b.toString(16).padStart(2, '0')).join('');
			return `${十六进制哈希.substr(0, 8)}-${十六进制哈希.substr(8, 4)}-4${十六进制哈希.substr(13, 3)}-${(parseInt(十六进制哈希.substr(16, 2), 16) & 0x3f | 0x80).toString(16)}${十六进制哈希.substr(18, 2)}-${十六进制哈希.substr(20, 12)}`;
		});
	}

	const 当前周数 = 获取当前周数(); // 获取当前周数
	const 结束时间 = new Date(起始日期.getTime() + 当前周数 * 一周的毫秒数);

	// 生成两个 UUID
	const 当前UUIDPromise = 生成UUID(密钥 + 当前周数);
	const 上一个UUIDPromise = 生成UUID(密钥 + (当前周数 - 1));

	// 格式化到期时间
	const 到期时间UTC = new Date(结束时间.getTime() - 时区偏移 * 60 * 60 * 1000); // UTC时间
	const 到期时间字符串 = `到期时间(UTC): ${到期时间UTC.toISOString().slice(0, 19).replace('T', ' ')} (UTC+8): ${结束时间.toISOString().slice(0, 19).replace('T', ' ')}\n`;

	return Promise.all([当前UUIDPromise, 上一个UUIDPromise, 到期时间字符串]);
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

	if (订阅链接 && 订阅链接.length !== 0) {
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
					value: response.status === 'fulfilled' ? response.value : null,
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

function utf8ToBase64(str) {
	return btoa(unescape(encodeURIComponent(str)));
}

export default {
	async fetch(request, env) {
		if (env.TOKEN) 快速订阅访问入口 = await 整理(env.TOKEN);
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID;
		subConverter = env.SUBAPI || subConverter;
		subConfig = env.SUBCONFIG || subConfig;
		FileName = env.SUBNAME || FileName;
		socks5DataURL = env.SOCKS5DATA || socks5DataURL;
		if (env.CMPROXYIPS) 匹配PROXYIP = await 整理(env.CMPROXYIPS);;
		if (env.CFPORTS) httpsPorts = await 整理(env.CFPORTS);
		EndPS = env.PS || EndPS;
		网站图标 = env.ICO ? `<link rel="icon" sizes="32x32" href="${env.ICO}">` : '';
		网站头像 = env.PNG ? `<div class="logo-wrapper"><div class="logo-border"></div><img src="${env.PNG}" alt="Logo"></div>` : '';
		if (env.IMG) {
			const imgs = await 整理(env.IMG);
			网站背景 = `background-image: url('${imgs[Math.floor(Math.random() * imgs.length)]}');`;
		} else 网站背景 = '';
		网络备案 = env.BEIAN || env.BY || 网络备案;
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);
		const format = url.searchParams.get('format') ? url.searchParams.get('format').toLowerCase() : "null";
		let host = "";
		let uuid = "";
		let path = "";
		let sni = "";
		let type = "ws";
		alpn = env.ALPN || alpn;
		let UD = Math.floor(((timestamp - Date.now()) / timestamp * 99 * 1099511627776) / 2);
		if (env.UA) MamaJustKilledAMan = MamaJustKilledAMan.concat(await 整理(env.UA));

		const currentDate = new Date();
		const fakeUserIDMD5 = await MD5MD5(Math.ceil(currentDate.getTime()));
		fakeUserID = fakeUserIDMD5.slice(0, 8) + "-" + fakeUserIDMD5.slice(8, 12) + "-" + fakeUserIDMD5.slice(12, 16) + "-" + fakeUserIDMD5.slice(16, 20) + "-" + fakeUserIDMD5.slice(20);
		fakeHostName = fakeUserIDMD5.slice(6, 9) + "." + fakeUserIDMD5.slice(13, 19) + ".xyz";

		total = total * 1099511627776;
		let expire = Math.floor(timestamp / 1000);

		link = env.LINK || link;

		if (env.ADD) addresses = await 整理(env.ADD);
		if (env.ADDAPI) addressesapi = await 整理(env.ADDAPI);
		if (env.ADDNOTLS) addressesnotls = await 整理(env.ADDNOTLS);
		if (env.ADDNOTLSAPI) addressesnotlsapi = await 整理(env.ADDNOTLSAPI);
		if (env.ADDCSV) addressescsv = await 整理(env.ADDCSV);
		DLS = Number(env.DLS) || DLS;
		remarkIndex = Number(env.CSVREMARK) || remarkIndex;

		if (socks5DataURL) {
			try {
				const response = await fetch(socks5DataURL);
				const socks5DataText = await response.text();
				if (socks5DataText.includes('\r\n')) {
					socks5Data = socks5DataText.split('\r\n').filter(line => line.trim() !== '');
				} else {
					socks5Data = socks5DataText.split('\n').filter(line => line.trim() !== '');
				}
			} catch {
				socks5Data = null;
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

			if (env.PASSWORD) {
				协议类型 = atob('VHJvamFu');
				uuid = env.PASSWORD
			} else {
				协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
				if (env.KEY) {
					有效时间 = Number(env.TIME) || 有效时间;
					更新时间 = Number(env.UPTIME) || 更新时间;
					const userIDs = await 生成动态UUID(env.KEY);
					uuid = userIDs[0];
				} else {
					uuid = env.UUID || "null";
				}
			}

			path = env.PATH || "/?ed=2560";
			sni = env.SNI || host;
			type = env.TYPE || type;
			隧道版本作者 = env.ED || 隧道版本作者;
			获取代理IP = env.RPROXYIP || 'false';

			if (host == "null" || uuid == "null") {
				let 空字段;
				if (host == "null" && uuid == "null") 空字段 = "HOST/UUID";
				else if (host == "null") 空字段 = "HOST";
				else if (uuid == "null") 空字段 = "UUID";
				EndPS += ` 订阅器内置节点 ${空字段} 未设置！！！`;
			}

			await sendMessage(`#获取订阅 ${FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgentHeader}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
		} else {
			host = url.searchParams.get('host');
			uuid = url.searchParams.get('uuid') || url.searchParams.get('password') || url.searchParams.get('pw');
			path = url.searchParams.get('path');
			sni = url.searchParams.get('sni') || host;
			type = url.searchParams.get('type') || type;
			const mode = url.searchParams.get('mode') || null;
			const extra = url.searchParams.get('extra') || null;
			xhttp = (mode ? `&mode=${mode}` : "") + (extra ? `&extra=${encodeURIComponent(extra)}` : "");
			alpn = url.searchParams.get('alpn') || (xhttp ? "h3%2Ch2" : alpn);
			隧道版本作者 = url.searchParams.get(atob('ZWRnZXR1bm5lbA==')) || url.searchParams.get(atob('ZXBlaXVz')) || 隧道版本作者;
			获取代理IP = url.searchParams.get('proxyip') || 'false';

			if (url.searchParams.has('alterid')) {
				协议类型 = 'VMess';
				额外ID = url.searchParams.get('alterid') || 额外ID;
				加密方式 = url.searchParams.get('security') || 加密方式;
			} else if (url.searchParams.has(atob('ZWRnZXR1bm5lbA==')) || url.searchParams.has('uuid')) {
				协议类型 = atob('VkxFU1M=');
			} else if (url.searchParams.has(atob('ZXBlaXVz')) || url.searchParams.has('password') || url.searchParams.has('pw')) {
				协议类型 = atob('VHJvamFu');
			}

			if (!url.pathname.includes("/sub")) {
				const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
				if (envKey) {
					const URLs = await 整理(env[envKey]);
					if (URLs.includes('nginx')) {
						return new Response(await nginx(), {
							headers: {
								'Content-Type': 'text/html; charset=UTF-8',
							},
						});
					}
					const URL = URLs[Math.floor(Math.random() * URLs.length)];
					return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
				}
				return await subHtml(request);
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
		let subConverterUrl = generateFakeInfo(url.href, uuid, host);
		if (userAgent.includes('subconverter')) alpn = '';
		if (!userAgent.includes('subconverter') && MamaJustKilledAMan.some(PutAGunAgainstHisHeadPulledMyTriggerNowHesDead => userAgent.includes(PutAGunAgainstHisHeadPulledMyTriggerNowHesDead)) && MamaJustKilledAMan.length > 0) {
			const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
			if (envKey) {
				const URLs = await 整理(env[envKey]);
				if (URLs.includes('nginx')) {
					return new Response(await nginx(), {
						headers: {
							'Content-Type': 'text/html; charset=UTF-8',
						},
					});
				}
				const URL = URLs[Math.floor(Math.random() * URLs.length)];
				return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
			}
			return await subHtml(request);
		} else if ((userAgent.includes('clash') || (format === 'clash' && !userAgent.includes('subconverter'))) && !userAgent.includes('nekobox') && !userAgent.includes('cf-workers-sub')) {
			subConverterUrl = `https://${subConverter}/sub?target=clash&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
		} else if ((userAgent.includes('sing-box') || userAgent.includes('singbox') || (format === 'singbox' && !userAgent.includes('subconverter'))) && !userAgent.includes('cf-workers-sub')) {
			if (协议类型 == 'VMess' && url.href.includes('path=')) {
				const 路径参数前部分 = url.href.split('path=')[0];
				const parts = url.href.split('path=')[1].split('&');
				const 路径参数后部分 = parts.slice(1).join('&') || '';
				const 待处理路径参数 = url.href.split('path=')[1].split('&')[0] || '';
				if (待处理路径参数.includes('%3F')) subConverterUrl = generateFakeInfo(路径参数前部分 + 'path=' + 待处理路径参数.split('%3F')[0] + '&' + 路径参数后部分, uuid, host);
			}
			subConverterUrl = `https://${subConverter}/sub?target=singbox&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
		} else {
			if (host.includes('workers.dev')) {
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
			const uniqueAddresses = Array.from(new Set(addresses.concat(newAddressesapi, newAddressescsv).filter(item => item && item.trim())));

			let notlsresponseBody;
			if ((noTLS == 'true' && 协议类型 == atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`)) || 协议类型 == 'VMess') {
				const newAddressesnotlsapi = await 整理优选列表(addressesnotlsapi);
				const newAddressesnotlscsv = await 整理测速结果('FALSE');
				const uniqueAddressesnotls = Array.from(new Set(addressesnotls.concat(newAddressesnotlsapi, newAddressesnotlscsv).filter(item => item && item.trim())));

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

					const httpPorts = ["8080", "8880", "2052", "2082", "2086", "2095"];
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
								if (item.includes('#') && item.split('#')[1] && lowerAddressid.includes(item.split('#')[1].toLowerCase())) {
									foundProxyIP = item.split('#')[0];
									break; // 找到匹配项，跳出循环
								} else if (item.includes(':') && item.split(':')[1] && lowerAddressid.includes(item.split(':')[1].toLowerCase())) {
									foundProxyIP = item.split(':')[0];
									break; // 找到匹配项，跳出循环
								}
							}

							if (foundProxyIP) {
								// 如果找到匹配的proxyIP，赋值给path
								path = atob('L3Byb3h5aXA9') + foundProxyIP;
							} else {
								// 如果没有找到匹配项，随机选择一个proxyIP
								const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
								path = atob('L3Byb3h5aXA9') + randomProxyIP;
							}
						}
					}

					if (协议类型 == 'VMess') {
						const vmessLink = `vmess://${utf8ToBase64(`{"v":"2","ps":"${addressid + EndPS}","add":"${address}","port":"${port}","id":"${uuid}","aid":"${额外ID}","scy":"${加密方式}","net":"ws","type":"${type}","host":"${host}","path":"${path}","tls":"","sni":"","alpn":"${encodeURIComponent(alpn)}","fp":""}`)}`;
						return vmessLink;
					} else {
						const 维列斯Link = `${atob('dmxlc3M6Ly8=') + uuid}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT0mdHlwZT0=') + type}&host=${host}&path=${encodeURIComponent(path)}#${encodeURIComponent(addressid + EndPS)}`;
						return 维列斯Link;
					}

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
							if (item.includes('#') && item.split('#')[1] && lowerAddressid.includes(item.split('#')[1].toLowerCase())) {
								foundProxyIP = item.split('#')[0];
								break; // 找到匹配项，跳出循环
							} else if (item.includes(':') && item.split(':')[1] && lowerAddressid.includes(item.split(':')[1].toLowerCase())) {
								foundProxyIP = item.split(':')[0];
								break; // 找到匹配项，跳出循环
							}
						}

						const matchingProxyIP = proxyIPPool.find(proxyIP => proxyIP.includes(address));
						if (matchingProxyIP) {
							path = atob('L3Byb3h5aXA9') + matchingProxyIP;
						} else if (foundProxyIP) {
							// 如果找到匹配的proxyIP，赋值给path
							path = atob('L3Byb3h5aXA9') + foundProxyIP;
						} else {
							// 如果没有找到匹配项，随机选择一个proxyIP
							const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
							path = atob('L3Byb3h5aXA9') + randomProxyIP;
						}
					}
				}

				let 伪装域名 = host;
				let 最终路径 = path;
				let 节点备注 = EndPS;
				if (临时中转域名.length > 0 && (host.includes('.workers.dev'))) {
					最终路径 = `/${host}${path}`;
					伪装域名 = 临时中转域名[Math.floor(Math.random() * 临时中转域名.length)];
					节点备注 = EndPS + atob('IOW3suWQr+eUqOS4tOaXtuWfn+WQjeS4rei9rOacjeWKoe+8jOivt+WwveW/q+e7keWumuiHquWumuS5ieWfn++8gQ==');
					sni = 伪装域名;
				}

				if (协议类型 == 'VMess') {
					const vmessLink = `vmess://${utf8ToBase64(`{"v":"2","ps":"${addressid + 节点备注}","add":"${address}","port":"${port}","id":"${uuid}","aid":"${额外ID}","scy":"${加密方式}","net":"ws","type":"${type}","host":"${伪装域名}","path":"${最终路径}","tls":"tls","sni":"${sni}","alpn":"${encodeURIComponent(alpn)}","fp":"","allowInsecure":"1","fragment":"1,40-60,30-50,tlshello"}`)}`;
					return vmessLink;
				} else if (协议类型 == atob('VHJvamFu')) {
					const 特洛伊Link = `${atob('dHJvamFuOi8v') + uuid}@${address}:${port + atob('P3NlY3VyaXR5PXRscyZzbmk9') + sni}&alpn=${encodeURIComponent(alpn)}&fp=randomized&type=${type}&host=${伪装域名}&path=${encodeURIComponent(最终路径)}&allowInsecure=1&fragment=1,40-60,30-50,tlshello#${encodeURIComponent(addressid + 节点备注)}`;
					return 特洛伊Link;
				} else {
					const 维列斯Link = `${atob('dmxlc3M6Ly8=') + uuid}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT10bHMmc25pPQ==') + sni}&alpn=${encodeURIComponent(alpn)}&fp=random&type=${type}&host=${伪装域名}&path=${encodeURIComponent(最终路径) + xhttp}&allowInsecure=1&fragment=1,40-60,30-50,tlshello#${encodeURIComponent(addressid + 节点备注)}`;
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

			if (协议类型 == atob('VHJvamFu') && (userAgent.includes('surge') || (format === 'surge' && !userAgent.includes('subconverter'))) && !userAgent.includes('cf-workers-sub')) {
				const 特洛伊Links = combinedContent.split('\n');
				const 特洛伊LinksJ8 = generateFakeInfo(特洛伊Links.join('|'), uuid, host);
				subConverterUrl = `https://${subConverter}/sub?target=surge&ver=4&url=${encodeURIComponent(特洛伊LinksJ8)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=true&fdn=false`;
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
						//"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
					},
				});

				return response;
			}

		}

		try {
			const subConverterResponse = await fetch(subConverterUrl);

			if (!subConverterResponse.ok) {
				throw new Error(`Error fetching subConverterUrl: ${subConverterResponse.status} ${subConverterResponse.statusText}`);
			}

			let subConverterContent = await subConverterResponse.text();

			if (协议类型 == atob('VHJvamFu') && (userAgent.includes('surge') || (format === 'surge' && !userAgent.includes('subconverter'))) && !userAgent.includes('cf-workers-sub')) {
				subConverterContent = surge(subConverterContent, host, path);
			}
			subConverterContent = revertFakeInfo(subConverterContent, uuid, host);
			return new Response(subConverterContent, {
				headers: {
					"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
					"content-type": "text/plain; charset=utf-8",
					"Profile-Update-Interval": `${SUBUpdateTime}`,
					//"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
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

async function subHtml(request) {
	const url = new URL(request.url);
	const HTML = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${FileName}</title>
				${网站图标}
				<style>
					:root {
						--primary-color: #4361ee;
						--hover-color: #3b4fd3;
						--bg-color: #f5f6fa;
						--card-bg: #ffffff;
					}
					
					* {
						box-sizing: border-box;
						margin: 0;
						padding: 0;
					}
					
					body {
						${网站背景}
						background-size: cover;
						background-position: center;
						background-attachment: fixed;
						background-color: var(--bg-color);
						font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
						line-height: 1.6;
						color: #333;
						min-height: 100vh;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					
					.container {
						position: relative;
						/* 使用rgba设置半透明背景 */
						background: rgba(255, 255, 255, 0.7);
						/* 添加磨砂玻璃效果 */
						backdrop-filter: blur(10px);
						-webkit-backdrop-filter: blur(10px); /* Safari兼容 */
						max-width: 600px;
						width: 90%;
						padding: 2rem;
						border-radius: 20px;
						/* 调整阴影效果增加通透感 */
						box-shadow: 0 10px 20px rgba(0,0,0,0.05),
									inset 0 0 0 1px rgba(255, 255, 255, 0.1);
						transition: transform 0.3s ease;
					}

					/* 调整hover效果 */
					.container:hover {
						transform: translateY(-5px);
						box-shadow: 0 15px 30px rgba(0,0,0,0.1),
									inset 0 0 0 1px rgba(255, 255, 255, 0.2);
					}
					
					h1 {
						text-align: center;
						color: var(--primary-color);
						margin-bottom: 2rem;
						font-size: 1.8rem;
					}
					
					.input-group {
						margin-bottom: 1.5rem;
					}
					
					label {
						display: block;
						margin-bottom: 0.5rem;
						color: #555;
						font-weight: 500;
					}
					
					input {
						width: 100%;
						padding: 12px;
						/* 修改边框颜色从 #eee 到更深的颜色 */
						border: 2px solid rgba(0, 0, 0, 0.15);  /* 使用rgba实现更自然的深度 */
						border-radius: 10px;
						font-size: 1rem;
						transition: all 0.3s ease;
						/* 添加轻微的内阴影增强边框效果 */
						box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
					}

					input:focus {
						outline: none;
						border-color: var(--primary-color);
						/* 增强focus状态下的阴影效果 */
						box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15),
									inset 0 2px 4px rgba(0, 0, 0, 0.03);
					}
					
					button {
						width: 100%;
						padding: 12px;
						background-color: var(--primary-color);
						color: white;
						border: none;
						border-radius: 10px;
						font-size: 1rem;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.3s ease;
						margin-bottom: 1.5rem;
					}
					
					button:hover {
						background-color: var(--hover-color);
						transform: translateY(-2px);
					}
					
					button:active {
						transform: translateY(0);
					}
					
					#result {
						background-color: #f8f9fa;
						font-family: monospace;
						word-break: break-all;
					}

					.github-corner svg {
						fill: var(--primary-color);
						color: var(--card-bg);
						position: absolute;
						top: 0;
						right: 0;
						border: 0;
						width: 80px;
						height: 80px;
					}

					.github-corner:hover .octo-arm {
						animation: octocat-wave 560ms ease-in-out;
					}

					@keyframes octocat-wave {
						0%, 100% { transform: rotate(0) }
						20%, 60% { transform: rotate(-25deg) }
						40%, 80% { transform: rotate(10deg) }
					}

					@keyframes rotate {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}

					.logo-title {
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 2rem;
					}

					.logo-wrapper {
						position: absolute;
						left: 0;
						width: 50px;
						height: 50px;
					}

					.logo-title img {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						position: relative;
						z-index: 1;
						background: var(--card-bg);
						box-shadow: 0 0 15px rgba(67, 97, 238, 0.1);
					}

					.logo-border {
						position: absolute;
						/* 扩大边框范围以确保完全覆盖 */
						top: -3px;
						left: -3px;
						right: -3px;
						bottom: -3px;
						border-radius: 50%;
						animation: rotate 3s linear infinite;
						background: conic-gradient(
							from 0deg,
							transparent 0%,
							var(--primary-color) 20%,
							rgba(67, 97, 238, 0.8) 40%,
							transparent 60%,
							transparent 100%
						);
						box-shadow: 0 0 10px rgba(67, 97, 238, 0.3);
						filter: blur(0.5px);
					}

					.logo-border::after {
						content: '';
						position: absolute;
						/* 调整内圆遮罩的大小 */
						inset: 3px;
						border-radius: 50%;
						background: var(--card-bg);
					}

					@keyframes rotate {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}

					.logo-title h1 {
						margin-bottom: 0;
						text-align: center;
					}

					@media (max-width: 480px) {
						.container {
							padding: 1.5rem;
						}
						
						h1 {
							font-size: 1.5rem;
						}

						.github-corner:hover .octo-arm {
							animation: none;
						}
						.github-corner .octo-arm {
							animation: octocat-wave 560ms ease-in-out;
						}

						.logo-wrapper {
							width: 40px;
							height: 40px;
						}
					}

					.beian-info {
						text-align: center;
						font-size: 13px;
					}

					.beian-info a {
						color: var(--primary-color);
						text-decoration: none;
						border-bottom: 1px dashed var(--primary-color);
						padding-bottom: 2px;
					}

					.beian-info a:hover {
						border-bottom-style: solid;
					}

					#qrcode {
						display: flex;
						justify-content: center;
						align-items: center;
						margin-top: 20px;
					}

					.info-icon {
						display: inline-flex;
						align-items: center;
						justify-content: center;
						width: 18px;
						height: 18px;
						border-radius: 50%;
						background-color: var(--primary-color);
						color: white;
						font-size: 12px;
						margin-left: 8px;
						cursor: pointer;
						font-weight: bold;
						position: relative;   /* 添加相对定位 */
						top: -3px;            /* 微调垂直位置 */
					}

					.info-tooltip {
						display: none;
						position: fixed; /* 改为固定定位 */
						background: white;
						border: 1px solid var(--primary-color);
						border-radius: 8px;
						padding: 15px;
						z-index: 1000;
						box-shadow: 0 2px 10px rgba(0,0,0,0.1);
						min-width: 200px;
						max-width: 90vw;  /* 视窗宽度的90% */
						width: max-content;  /* 根据内容自适应宽度 */
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%); /* 居中定位 */
						margin: 0;
						line-height: 1.6;
						font-size: 13px;
						white-space: normal;
						word-wrap: break-word;
						overflow-wrap: break-word;
					}

					/* 移除原来的箭头 */
					.info-tooltip::before {
						display: none;
					}
				</style>
				<script src="https://cdn.jsdelivr.net/npm/@keeex/qrcodejs-kx@1.0.2/qrcode.min.js"></script>
			</head>
			<body>
				<a href="${atob('aHR0cHM6Ly9naXRodWIuY29tL2NtbGl1L1dvcmtlclZsZXNzMnN1Yg==')}" target="_blank" class="github-corner" aria-label="View source on Github">
					<svg viewBox="0 0 250 250" aria-hidden="true">
						<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
						<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
						<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
					</svg>
				</a>
				<div class="container">
						<div class="logo-title">
							${网站头像}
							<h1>${FileName}</h1>
						</div>
					<div class="input-group">
						<label for="link">节点链接</label>
						<input type="text" id="link" placeholder="${decodeURIComponent(atob('JUU4JUFGJUI3JUU4JUJFJTkzJUU1JTg1JUE1JTIwVk1lc3MlMjAlMkYlMjBWTEVTUyUyMCUyRiUyMFRyb2phbiUyMCVFOSU5MyVCRSVFNiU4RSVBNQ=='))}">
					</div>
					
					<button onclick="generateLink()">生成优选订阅</button>
					
					<div class="input-group">
						<div style="display: flex; align-items: center;">
							<label for="result">优选订阅</label>
							<div style="position: relative;">
								<span class="info-icon" onclick="toggleTooltip(event)">!</span>
								<div class="info-tooltip" id="infoTooltip">
									<strong>安全提示</strong>：使用优选订阅生成器时，需要您提交 <strong>节点配置信息</strong> 用于生成优选订阅链接。这意味着订阅器的维护者可能会获取到该节点信息。<strong>请自行斟酌使用风险。</strong><br>
									<br>
									订阅转换后端：<strong>${subConverter}</strong><br>
									订阅转换配置文件：<strong>${subConfig}</strong>
								</div>
							</div>
						</div>
						<input type="text" id="result" readonly onclick="copyToClipboard()">
						<label id="qrcode" style="margin: 15px 10px -15px 10px;"></label>
					</div>
					<div class="beian-info" style="text-align: center; font-size: 13px;">${网络备案}</div>
				</div>
	
				<script>
					function toggleTooltip(event) {
						event.stopPropagation(); // 阻止事件冒泡
						const tooltip = document.getElementById('infoTooltip');
						tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
					}
					
					// 点击页面其他区域关闭提示框
					document.addEventListener('click', function(event) {
						const tooltip = document.getElementById('infoTooltip');
						const infoIcon = document.querySelector('.info-icon');
						
						if (!tooltip.contains(event.target) && !infoIcon.contains(event.target)) {
							tooltip.style.display = 'none';
						}
					});

					function copyToClipboard() {
						const resultInput = document.getElementById('result');
						if (!resultInput.value) {
							return;
						}
						
						resultInput.select();
						navigator.clipboard.writeText(resultInput.value).then(() => {
							const tooltip = document.createElement('div');
							tooltip.style.position = 'fixed';
							tooltip.style.left = '50%';
							tooltip.style.top = '20px';
							tooltip.style.transform = 'translateX(-50%)';
							tooltip.style.padding = '8px 16px';
							tooltip.style.background = '#4361ee';
							tooltip.style.color = 'white';
							tooltip.style.borderRadius = '4px';
							tooltip.style.zIndex = '1000';
							tooltip.textContent = '已复制到剪贴板';
							
							document.body.appendChild(tooltip);
							
							setTimeout(() => {
								document.body.removeChild(tooltip);
							}, 2000);
						}).catch(err => {
							alert('复制失败，请手动复制');
						});
					}
	
					function generateLink() {
						const link = document.getElementById('link').value;
						if (!link) {
							alert('请输入节点链接');
							return;
						}
						
						let uuidType = 'uuid';
						const isTrojan = link.startsWith(\`\${atob('dHJvamFuOi8v')}\`);
						if (isTrojan) uuidType = 'password';
						let subLink = '';
						try {
							const isVMess = link.startsWith('vmess://');
							if (isVMess){
								const vmessLink = link.split('vmess://')[1];
								const vmessJson = JSON.parse(atob(vmessLink));
								
								const host = vmessJson.host;
								const uuid = vmessJson.id;
								const path = vmessJson.path || '/';
								const sni = vmessJson.sni || host;
								const type = vmessJson.type || 'none';
								const alpn = vmessJson.alpn || '';
								const alterId = vmessJson.aid || 0;
								const security = vmessJson.scy || 'auto';
								const domain = window.location.hostname;
								
								subLink = \`https://\${domain}/sub?host=\${host}&uuid=\${uuid}&path=\${encodeURIComponent(path)}&sni=\${sni}&type=\${type}&alpn=\${encodeURIComponent(alpn)}&alterid=\${alterId}&security=\${security}\`;
							} else {
								const uuid = link.split("//")[1].split("@")[0];
								const search = link.split("?")[1].split("#")[0];
								const domain = window.location.hostname;
								
								subLink = \`https://\${domain}/sub?\${uuidType}=\${uuid}&\${search}\`;
							}
							document.getElementById('result').value = subLink;
	
							// 更新二维码
							const qrcodeDiv = document.getElementById('qrcode');
							qrcodeDiv.innerHTML = '';
							new QRCode(qrcodeDiv, {
								text: subLink,
								width: 220, // 调整宽度
								height: 220, // 调整高度
								colorDark: "#4a60ea", // 二维码颜色
								colorLight: "#ffffff", // 背景颜色
								correctLevel: QRCode.CorrectLevel.L, // 设置纠错级别
								scale: 1 // 调整像素颗粒度
							});
						} catch (error) {
							alert('链接格式错误，请检查输入');
						}
					}
				</script>
			</body>
			</html>
			`;

	return new Response(HTML, {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	});
}