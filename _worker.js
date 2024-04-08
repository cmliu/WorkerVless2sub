
// 部署完成后在网址后面加上这个，获取订阅器默认节点，/auto

let mytoken= ['auto'];//快速订阅访问入口, 留空则不启动快速订阅

// 设置优选地址，不带端口号默认443，TLS订阅生成
let addresses = [
	'icook.tw:2053#官方优选域名',
	'cloudflare.cfgo.cc#优选官方线路',
];

// 设置优选地址api接口
let addressesapi = [
	'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt', //可参考内容格式 自行搭建。
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
	'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/addressesapi.txt',
];

let DLS = 8;//速度下限
let addressescsv = [
	//'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv', //iptest测速结果文件。
];

let subconverter = "apiurl.v1.mk"; //在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"; //订阅配置文件
let noTLS = true; // false
let BotToken =''; //可以为空，或者@BotFather中输入/start，/newbot，并关注机器人
let ChatID =''; //可以为空，或者@userinfobot中获取，/start
let vmessLinks = [ //本地CFcdnVmess节点池
	//'vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIk5MIiwNCiAgImFkZCI6ICJjZi4wOTAyMjcueHl6IiwNCiAgInBvcnQiOiAiNDQzIiwNCiAgImlkIjogIjA2MTk1YjViLTM4MTUtNGEwNy05NmY3LTQ3ZWVmYmIxYjE0MyIsDQogICJhaWQiOiAiMCIsDQogICJzY3kiOiAiYXV0byIsDQogICJuZXQiOiAid3MiLA0KICAidHlwZSI6ICJub25lIiwNCiAgImhvc3QiOiAidXJueGV3enZoLnNpdGUiLA0KICAicGF0aCI6ICIva3dobXZ3cyIsDQogICJ0bHMiOiAidGxzIiwNCiAgInNuaSI6ICJ1cm54ZXd6dmguc2l0ZSIsDQogICJhbHBuIjogIiIsDQogICJmcCI6ICIiDQp9',
];
let vmessLinksURL = 'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/vmesslinks';//CFcdnVmess节点池URL
let proxyhosts = [//本地代理域名池
	//'ppfv2tl9veojd-maillazy.pages.dev',
];
let proxyhostsURL = 'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/proxyhosts';//在线代理域名池URL
let FileName = 'CFcdnVmess2sub';
let SUBUpdateTime = 6; 
let total = 99;//PB
//let timestamp = now;
let timestamp = 4102329600000;//2099-12-31
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;

function utf8ToBase64(str) {
	return btoa(unescape(encodeURIComponent(str)));
}

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

async function getAddressesapi(api) {
	if (!api || api.length === 0) {
		return [];
	}

	let newapi = "";
	try {
		const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl,{
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': 'cmliu/CFcdnVmess2sub'
			}
		}).then(response => response.ok ? response.text() : Promise.reject())));
			
		for (const response of responses) {
			if (response.status === 'fulfilled') {
				const content = await response.value;
				newapi += content + '\n';
			}
		}
	} catch (error) {
		console.error(error);
	}
	const newAddressesapi = await ADD(newapi);
/*
	let newAddressesapi = [];
	
	for (const apiUrl of api) {
		try {
			const response = await fetch(apiUrl);
		
			if (!response.ok) {
				console.error('获取地址时出错:', response.status, response.statusText);
				continue;
			}
		
			const text = await response.text();
			let lines;
			if (text.includes('\r\n')){
				lines = text.split('\r\n');
			} else {
				lines = text.split('\n');
			}
			//const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(#.*)?$/;
		
			const apiAddresses = lines.map(line => {
				const match = line.match(regex);
				return match ? match[0] : null;
			}).filter(Boolean);
		
			newAddressesapi = newAddressesapi.concat(apiAddresses);
		} catch (error) {
			console.error('获取地址时出错:', error);
			continue;
		}
	}
*/
	
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
			const speedIndex = header.length - 1; // 最后一个字段
		
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
		
				// 检查TLS是否为"TRUE"且速度大于DLS
				if (columns[tlsIndex].toUpperCase() === tls && parseFloat(columns[speedIndex]) > DLS) {
					const ipAddress = columns[ipAddressIndex];
					const port = columns[portIndex];
					const dataCenter = columns[dataCenterIndex];
			
					const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
					newAddressescsv.push(formattedAddress);
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
	var addtext = envadd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');  // 双引号、单引号和换行符替换为逗号
	//console.log(addtext);
	if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	if (addtext.charAt(addtext.length -1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	const add = addtext.split(',');
	//console.log(add);
	return add ;
}

export default {
	async fetch(request, env) {
		if (env.TOKEN) mytoken = await ADD(env.TOKEN);
		//mytoken = env.TOKEN || mytoken;
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID; 
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;
		FileName = env.SUBNAME || FileName;
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);
		let cc = "";
		let host = "";
		let uuid = "";
		let path = "";
		let alterid = "";
		let security = "";
		let sni = "";
		let UD = Math.floor(((timestamp - Date.now())/timestamp * 99 * 1099511627776 * 1024)/2);
		total = total * 1099511627776 * 1024;
		let expire= Math.floor(timestamp / 1000) ;
		
		if(env.LINK)vmessLinks = await ADD(env.LINK);
		else if (env.VMESS)vmessLinks = await ADD(env.VMESS);
		//console.log(vmessLinks);

		if (env.ADD) addresses = await ADD(env.ADD);
		if (env.ADDAPI) addressesapi = await ADD(env.ADDAPI);
		if (env.ADDNOTLS) addressesnotls = await ADD(env.ADDNOTLS);
		if (env.ADDNOTLSAPI) addressesnotlsapi = await ADD(env.ADDNOTLSAPI);
		if (env.ADDCSV) addressescsv = await ADD(env.ADDCSV);
		DLS = env.DLS || DLS;

		if (mytoken.length > 0 && mytoken.some(token => url.pathname.includes(token))) {
			if (vmessLinksURL && vmessLinks.length == 0) {
				try {
					const response = await fetch(vmessLinksURL); // 直接使用vmessLinksURL
				
					if (!response.ok) {
						console.error('获取地址时出错:', response.status, response.statusText);
						return; // 如果有错误，直接返回
					}
				
					const text = await response.text();
					const lines = text.split('\n');
					// 使用startsWith或者正则表达式检查每行
					const vmessLinksTest = lines.filter(line => line.startsWith('vmess://'));
				
					vmessLinks = vmessLinks.concat(vmessLinksTest);
				} catch (error) {
					console.error('获取地址时出错:', error);
				}
			}

		// 使用Set对象去重
		const uniquevmessLinks = [...new Set(vmessLinks)];
		const vmessLink = uniquevmessLinks[Math.floor(Math.random() * uniquevmessLinks.length)];
		noTLS = false;
		//console.log(vmessLinks);
		// 移除开头的"vmess://"并解码
		const base64Content = vmessLink.slice(8);
		const decodedString = atob(base64Content);

		// 将解码后的字符串转换为对象
		const obj = JSON.parse(decodedString);

		// 读取并赋值对应字段
		uuid = obj.id;
		path = '/'+ obj.host +':'+ obj.port + obj.path;
		//host = proxyhosts[Math.floor(Math.random() * proxyhosts.length)] ;
		alterid = obj.aid;
		security = obj.scy;

		// IPv4 正则表达式
		const ipv4Pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

		cc = '未知';
		let ipapiurl = 'http://ip-api.com/json/';

		// 根据 obj.ps 是否符合 IPv4 判断调用哪个 API
		if (ipv4Pattern.test(obj.ps)) {
			ipapiurl += obj.ps;
		} else {
			ipapiurl += obj.host;
		}
		ipapiurl += '?lang=zh-CN';

		// 发起请求
		const response = await fetch(ipapiurl);
		if(response.status == 200) {
			const ipInfo = await response.json();
			cc = ipInfo.country + " " + ipInfo.city;
		}

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
		const uniqueproxyhosts = [...new Set(proxyhosts)];
		host = uniqueproxyhosts[Math.floor(Math.random() * uniqueproxyhosts.length)];
		sni = host;

		await sendMessage("#Vmess订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
		} else {
			host = url.searchParams.get('host');
			uuid = url.searchParams.get('uuid');
			path = url.searchParams.get('path');
			alterid = url.searchParams.get('alterid');
			security = url.searchParams.get('security');
			sni = url.searchParams.get('sni') || host;
			cc = url.searchParams.get('cc');
			const pathp = url.pathname.replace(/^\/|\/$/g, "");
			if(pathp && !url.pathname.includes("/sub"))
			{
				const addrPath = url.pathname.replace(/^\/|\/$/g, "");
				const newUrl = new URL("https://" + addrPath);
				return fetch(new Request(newUrl, request));
			} else if (!url.pathname.includes("/sub")) {
				//首页改成一个nginx伪装页
				return new Response(`
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
				`, {
					headers: {
						'Content-Type': 'text/html; charset=UTF-8',
					},
				});
			
			}
			
			if (!host || !uuid) {
				const workerUrl = url.origin + url.pathname;
				const responseText = `
			缺少必填参数：host 和 uuid
			Missing required parameters: host and uuid
			پارامترهای ضروری وارد نشده: هاست و یوآی‌دی
			
			${workerUrl}?cc=[vmess name]&host=[your host]&uuid=[your uuid]&path=[your path]
			
			
			
			
			
			
				
				https://github.com/cmliu/CFcdnVmess2sub
				`;
			
				return new Response(responseText, {
				status: 400,
				headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
				}
			
				if (!path || path.trim() === '') {
				path = '/?ed=2048';
				} else {
				// 如果第一个字符不是斜杠，则在前面添加一个斜杠
				path = (path[0] === '/') ? path : '/' + path;
				}

				if (!alterid || alterid.trim() === '') {
				alterid = "0";
				}

				if (!security || security.trim() === '') {
				security = "auto";
				}

				if (!cc || cc.trim() === '') {
				cc = "US";
				}
			}

			if (userAgent.includes('telegram') || userAgent.includes('twitter') || userAgent.includes('miaoko')) {
			return new Response('Hello World!');
			} else if (userAgent.includes('clash')) {
			const subconverterUrl = `https://${subconverter}/sub?target=clash&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

			try {
				const subconverterResponse = await fetch(subconverterUrl);
			
				if (!subconverterResponse.ok) {
				throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
			
				const subconverterContent = await subconverterResponse.text();
			
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
			} else if (userAgent.includes('sing-box') || userAgent.includes('singbox')){
			const subconverterUrl = `https://${subconverter}/sub?target=singbox&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

			try {
				const subconverterResponse = await fetch(subconverterUrl);
			
				if (!subconverterResponse.ok) {
				throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
			
				const subconverterContent = await subconverterResponse.text();
			
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
		} else {
			let notlsresponseBody;
			if(noTLS == true){
				const newAddressesnotlsapi = await getAddressesapi(addressesnotlsapi);
				const newAddressesnotlscsv = await getAddressescsv('FALSE');
				addressesnotls = addressesnotls.concat(newAddressesnotlsapi);
				addressesnotls = addressesnotls.concat(newAddressesnotlscsv);
	
				const uniqueAddressesnotls = [...new Set(addressesnotls)];
	
				notlsresponseBody = uniqueAddressesnotls.map(address => {
					let port = "80";
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
				
					const vmess = `{
"v": "2",
"ps": "${addressid}>${cc}",
"add": "${address}",
"port": "${port}",
"id": "${uuid}",
"aid": "${alterid}",
"scy": "${security}",
"net": "ws",
"type": "none",
"host": "${host}",
"path": "${path}",
"tls": "",
"sni": "",
"alpn": "",
"fp": ""
}`;
				
					const base64Encoded = utf8ToBase64(vmess);
					const vmessLink = `vmess://${base64Encoded}`;
				
					return vmessLink;
				}).join('\n');
			}

		const newAddressesapi = await getAddressesapi(addressesapi);
		const newAddressescsv = await getAddressescsv('TRUE');
		addresses = addresses.concat(newAddressesapi);
		addresses = addresses.concat(newAddressescsv);
		
		// 使用Set对象去重
		const uniqueAddresses = [...new Set(addresses)];
		
		const responseBody = uniqueAddresses.map(address => {
			let port = "443";
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
		
			const vmess = `{
"v": "2",
"ps": "${addressid}>${cc}",
"add": "${address}",
"port": "${port}",
"id": "${uuid}",
"aid": "${alterid}",
"scy": "${security}",
"net": "ws",
"type": "none",
"host": "${host}",
"path": "${path}",
"tls": "tls",
"sni": "${sni}",
"alpn": "",
"fp": ""
}`;
		
			const base64Encoded = utf8ToBase64(vmess);
			const vmessLink = `vmess://${base64Encoded}`;
		
			return vmessLink;
		}).join('\n');
		
		let 汇总 = responseBody;
		if (noTLS == true) 汇总 += '\n' + notlsresponseBody;
		const base64Response = btoa(汇总) ;
		
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
};
