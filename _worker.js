
// 部署完成后在网址后面加上这个，获取订阅器默认节点，/auto

let mytoken= ['auto'];//快速订阅访问入口, 留空则不启动快速订阅

// 设置优选地址，不带端口号默认443，TLS订阅生成
let addresses = [
	'icook.tw:2053#官方优选域名',
	'cloudflare.cfgo.cc#优选官方线路',
];

// 设置优选地址api接口
let addressesapi = [
	'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt?proxyip=true', //可参考内容格式 自行搭建。
	//'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesipv6api.txt', //IPv6优选内容格式 自行搭建。
];

// 设置优选地址，不带端口号默认80，noTLS订阅生成
let addressesnotls = [
	'www.visa.com.sg#官方优选域名',
	'www.wto.org:8080#官方优选域名',
	'www.who.int:8880#官方优选域名',
];

// 设置优选noTLS地址api接口
let addressesnotlsapi = [
	'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/addressesapi.txt', //可参考内容格式 自行搭建。
];

let DLS = 8;//速度下限
let addressescsv = [
	//'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv', //iptest测速结果文件。
];

let subconverter = "SUBAPI.fxxk.dedyn.io"; //在线订阅转换后端，目前使用CM的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"; //订阅转换配置文件
let noTLS = 'false'; //改为 true , 将不做域名判断 始终返回noTLS节点
let link;
let edgetunnel = 'ed';
let RproxyIP = 'false';
let proxyIPs = [//无法匹配到节点名就随机分配以下ProxyIP域名
	'proxyip.multacom.fxxk.dedyn.io',
	'proxyip.vultr.fxxk.dedyn.io',
];
let CMproxyIPs = [
	//'proxyip.aliyun.fxxk.dedyn.io#HK',//匹配节点名, 有HK就分配该ProxyIP域名
]
let socks5DataURL = '';//'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/socks5Data'
let BotToken ='';
let ChatID =''; 
let proxyhosts = [//本地代理域名池
	//'ppfv2tl9veojd-maillazy.pages.dev',
];
let proxyhostsURL = 'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/proxyhosts';//在线代理域名池URL
let EndPS = '';//节点名备注内容
let 协议类型 = 'VLESS';
let FileName = 'WorkerVless2sub';
let SUBUpdateTime = 6; 
let total = 99;//PB
//let timestamp = now;
let timestamp = 4102329600000;//2099-12-31
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
// 虚假uuid和hostname，用于发送给配置生成服务
let fakeUserID ;
let fakeHostName ;
let httpsPorts = ["2053","2083","2087","2096","8443"];
let effectiveTime = 7;//有效时间 单位:天
let updateTime = 3;//更新时间
async function sendMessage(type, ip, add_data = "") {
	if ( BotToken !== '' && ChatID !== ''){
		let msg = "";
		const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
		if (response.status == 200) {
			const ipInfo = await response.json();
			msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
		} else {
			msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
		}
	
		let url = "https://api.telegram.org/bot"+ BotToken +"/sendMessage?chat_id=" + ChatID + "&parse_mode=HTML&text=" + encodeURIComponent(msg);
		return fetch(url, {
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'Accept-Encoding': 'gzip, deflate, br',
				'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
			}
		});
	}
}

let MamaJustKilledAMan = ['telegram','twitter','miaoko'];
let proxyIPPool = [];
async function getAddressesapi(api) {
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
				'User-Agent': `${FileName} cmliu/WorkerVless2sub`
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
					proxyIPPool = proxyIPPool.concat((await ADD(content)).map(item => {
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

	const newAddressesapi = await ADD(newapi);

	// 返回处理后的结果
	return newAddressesapi;
}

async function getAddressescsv(tls) {
	if (!addressescsv || addressescsv.length === 0) {
		return [];
	}
	
	let newAddressescsv = [];
	
	for (const csvUrl of addressescsv) {
		try {
			const response = await fetch(csvUrl);
		
			if (!response.ok) {
				console.error('获取CSV地址时出错:', response.status, response.statusText);
				continue;
			}
		
			const text = await response.text();// 使用正确的字符编码解析文本内容
			let lines;
			if (text.includes('\r\n')){
				lines = text.split('\r\n');
			} else {
				lines = text.split('\n');
			}
		
			// 检查CSV头部是否包含必需字段
			const header = lines[0].split(',');
			const tlsIndex = header.indexOf('TLS');
			
			const ipAddressIndex = 0;// IP地址在 CSV 头部的位置
			const portIndex = 1;// 端口在 CSV 头部的位置
			const dataCenterIndex = tlsIndex + 1; // 数据中心是 TLS 的后一个字段
		
			if (tlsIndex === -1) {
				console.error('CSV文件缺少必需的字段');
				continue;
			}
		
			// 从第二行开始遍历CSV行
			for (let i = 1; i < lines.length; i++) {
				const columns = lines[i].split(',');
				const speedIndex = columns.length - 1; // 最后一个字段
				// 检查TLS是否为"TRUE"且速度大于DLS
				if (columns[tlsIndex].toUpperCase() === tls && parseFloat(columns[speedIndex]) > DLS) {
					const ipAddress = columns[ipAddressIndex];
					const port = columns[portIndex];
					const dataCenter = columns[dataCenterIndex];
			
					const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
					newAddressescsv.push(formattedAddress);
					if (csvUrl.includes('proxyip=true') && columns[tlsIndex].toUpperCase() == 'true' && !httpsPorts.includes(port)) {
						// 如果URL带有'proxyip=true'，则将内容添加到proxyIPPool
						proxyIPPool.push(`${ipAddress}:${port}`);
					}
				}
			}
		} catch (error) {
			console.error('获取CSV地址时出错:', error);
			continue;
		}
	}
	
	return newAddressescsv;
}

async function ADD(envadd) {
	var addtext = envadd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');	// 将空格、双引号、单引号和换行符替换为逗号
	//console.log(addtext);
	if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	if (addtext.charAt(addtext.length -1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	let add = [];
	if (addtext != '') add = addtext.split(',');
	//console.log(add);
	return add ;
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

let protocol;
let socks5Data;
export default {
	async fetch (request, env) {
		if (env.TOKEN) mytoken = await ADD(env.TOKEN);
		//mytoken = env.TOKEN.split(',') || mytoken;
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID; 
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;
		FileName = env.SUBNAME || FileName;
		socks5DataURL = env.SOCKS5DATA || socks5DataURL;
		if (env.CMPROXYIPS) CMproxyIPs = await ADD(env.CMPROXYIPS);;
		if (env.CFPORTS) httpsPorts = await ADD(env.CFPORTS);
		//console.log(CMproxyIPs);
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
		if (env.UA) MamaJustKilledAMan = MamaJustKilledAMan.concat(await ADD(env.UA));

		const currentDate = new Date();
		const fakeUserIDMD5 = await MD5MD5(Math.ceil(currentDate.getTime()));
		fakeUserID = fakeUserIDMD5.slice(0, 8) + "-" + fakeUserIDMD5.slice(8, 12) + "-" + fakeUserIDMD5.slice(12, 16) + "-" + fakeUserIDMD5.slice(16, 20) + "-" + fakeUserIDMD5.slice(20);
		fakeHostName = fakeUserIDMD5.slice(6, 9) + "." + fakeUserIDMD5.slice(13, 19) + ".xyz";
		//console.log(`${fakeUserID}\n${fakeHostName}`); // 打印fakeID

		total = total * 1099511627776 * 1024;
		let expire= Math.floor(timestamp / 1000) ;

		link = env.LINK || link;
		
		if (env.ADD) addresses = await ADD(env.ADD);
		if (env.ADDAPI) addressesapi = await ADD(env.ADDAPI);
		if (env.ADDNOTLS) addressesnotls = await ADD(env.ADDNOTLS);
		if (env.ADDNOTLSAPI) addressesnotlsapi = await ADD(env.ADDNOTLSAPI);
		if (env.ADDCSV) addressescsv = await ADD(env.ADDCSV);
		DLS = env.DLS || DLS;

		/*
		console.log(`
			addresses: ${addresses}
			addressesapi: ${addressesapi}
			addressesnotls: ${addressesnotls}
			addressesnotlsapi: ${addressesnotlsapi}
			addressescsv: ${addressescsv}
			DLS: ${DLS}
		`);
		*/
		
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
		
		if (env.PROXYIP) proxyIPs = await ADD(env.PROXYIP);
		//console.log(proxyIPs);

		if (mytoken.length > 0 && mytoken.some(token => url.pathname.includes(token))) {
			host = "null";
			if (env.HOST) {
				const hosts = await ADD(env.HOST);
				host = hosts[Math.floor(Math.random() * hosts.length)];
			}
			
			if (env.PASSWORD){
				协议类型 = 'Trojan';
				uuid = env.PASSWORD
			} else {
				协议类型 = 'VLESS';
				if (env.KEY) {
					const userIDs = await generateDynamicUUID(env.KEY);
					uuid = userIDs[0];
					effectiveTime = env.TIME || effectiveTime;
					updateTime = env.UPTIME || updateTime;
				} else {
					uuid = env.UUID || "null";
				}
			}
			
			path = env.PATH || "/?ed=2560";
			sni = env.SNI || host;
			type = env.TYPE || type;
			edgetunnel = env.ED || edgetunnel;
			RproxyIP = env.RPROXYIP || RproxyIP;

			if (host == "null" || uuid == "null" ){
				let 空字段;
				if (host == "null" && uuid == "null") 空字段 = "HOST/UUID";
				else if (host == "null") 空字段 = "HOST";
				else if (uuid == "null") 空字段 = "UUID";
				EndPS += ` 订阅器内置节点 ${空字段} 未设置！！！`;
			}

		await sendMessage("#VLESS订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgentHeader}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
		} else {
			host = url.searchParams.get('host');
			uuid = url.searchParams.get('uuid') || url.searchParams.get('password') || url.searchParams.get('pw');
			path = url.searchParams.get('path');
			sni = url.searchParams.get('sni') || host;
			type = url.searchParams.get('type') || type;
			edgetunnel = url.searchParams.get('edgetunnel') || url.searchParams.get('epeius') || edgetunnel;
			RproxyIP = url.searchParams.get('proxyip') || RproxyIP;

			if (url.searchParams.has('edgetunnel') || url.searchParams.has('uuid')){
				协议类型 = 'VLESS';
			} else if (url.searchParams.has('epeius') || url.searchParams.has('password') || url.searchParams.has('pw')){
				协议类型 = 'Trojan';
			}

			if (!url.pathname.includes("/sub")) {
				const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
				if (envKey) {
					const URLs = await ADD(env[envKey]);
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
			
			
			
			
			
			
				
				https://github.com/cmliu/WorkerVless2sub
				`;
			
				return new Response(responseText, {
				status: 400,
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
				const URLs = await ADD(env[envKey]);
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
			if(host.includes('workers.dev') || host.includes('pages.dev')) {
				if (proxyhostsURL) {
					try {
						const response = await fetch(proxyhostsURL); 
					
						if (!response.ok) {
							console.error('获取地址时出错:', response.status, response.statusText);
							return; // 如果有错误，直接返回
						}
					
						const text = await response.text();
						const lines = text.split('\n');
						// 过滤掉空行或只包含空白字符的行
						const nonEmptyLines = lines.filter(line => line.trim() !== '');
					
						proxyhosts = proxyhosts.concat(nonEmptyLines);
					} catch (error) {
						console.error('获取地址时出错:', error);
					}
				}
				// 使用Set对象去重
				proxyhosts = [...new Set(proxyhosts)];
			}
			
			const newAddressesapi = await getAddressesapi(addressesapi);
			const newAddressescsv = await getAddressescsv('TRUE');
			addresses = addresses.concat(newAddressesapi);
			addresses = addresses.concat(newAddressescsv);
			
			// 使用Set对象去重
			const uniqueAddresses = [...new Set(addresses)];
			
			let notlsresponseBody;
			if(noTLS == 'true' && 协议类型 == 'VLESS'){
				const newAddressesnotlsapi = await getAddressesapi(addressesnotlsapi);
				const newAddressesnotlscsv = await getAddressescsv('FALSE');
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

					if (edgetunnel.trim() === 'cmliu' && RproxyIP.trim() === 'true') {
						// 将addressid转换为小写
						let lowerAddressid = addressid.toLowerCase();
						// 初始化找到的proxyIP为null
						let foundProxyIP = null;
					
						if (socks5Data) {
							const socks5 = getRandomProxyByMatch(lowerAddressid, socks5Data);
							path = `/${socks5}`;
						} else {
							// 遍历CMproxyIPs数组查找匹配项
							for (let item of CMproxyIPs) {
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
								path = `/?ed=2560&proxyip=${foundProxyIP}`;
							} else {
								// 如果没有找到匹配项，随机选择一个proxyIP
								const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
								path = `/?ed=2560&proxyip=${randomProxyIP}`;
							}
						}
					}

					const vlessLink = `vless://${uuid}@${address}:${port}?encryption=none&security=&type=${type}&host=${host}&path=${encodeURIComponent(path)}#${encodeURIComponent(addressid + EndPS)}`;
			
					return vlessLink;

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
		
				if (edgetunnel.trim() === 'cmliu' && RproxyIP.trim() === 'true') {
					// 将addressid转换为小写
					let lowerAddressid = addressid.toLowerCase();
					// 初始化找到的proxyIP为null
					let foundProxyIP = null;
				
					if (socks5Data) {
						const socks5 = getRandomProxyByMatch(lowerAddressid, socks5Data);
						path = `/${socks5}`;
					} else {
						// 遍历CMproxyIPs数组查找匹配项
						for (let item of CMproxyIPs) {
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
							path = `/?ed=2560&proxyip=${matchingProxyIP}`;
						} else if (foundProxyIP) {
							// 如果找到匹配的proxyIP，赋值给path
							path = `/?ed=2560&proxyip=${foundProxyIP}`;
						} else {
							// 如果没有找到匹配项，随机选择一个proxyIP
							const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
							path = `/?ed=2560&proxyip=${randomProxyIP}`;
						}
					}
				}
				
				let 伪装域名 = host ;
				let 最终路径 = path ;
				let 节点备注 = EndPS ;
				if(proxyhosts && (host.includes('.workers.dev') || host.includes('pages.dev'))) {
					最终路径 = `/${host}${path}`;
					伪装域名 = proxyhosts[Math.floor(Math.random() * proxyhosts.length)];
					节点备注 = `${EndPS} 已启用临时域名中转服务，请尽快绑定自定义域！`;
					sni = 伪装域名;
				}

				if (协议类型 == 'Trojan'){
					const trojanLink = `trojan://${uuid}@${address}:${port}?security=tls&sni=${sni}&alpn=http%2F1.1&fp=randomized&type=${type}&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;
					return trojanLink;
				} else {
					const vlessLink = `vless://${uuid}@${address}:${port}?encryption=none&security=tls&sni=${sni}&alpn=http%2F1.1&fp=random&type=${type}&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;
					return vlessLink;
				}

			}).join('\n');
			
			let combinedContent = responseBody; // 合并内容
			
			if (link) {
				const links = await ADD(link);
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
					'User-Agent': `v2rayN/${FileName} cmliu/WorkerVless2sub`
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