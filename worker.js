addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
  })
  
  // 设置优选地址，不带端口号默认8443，不支持非TLS订阅生成
  let addresses = [
	'www.visa.com.hk:2096#假装是香港',
	'icook.tw:2053#假装是台湾',
	'cloudflare.cfgo.cc#真的是美国'
  ];
  
  // 设置优选地址api接口
  let addressesapi = [
	'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt' //可参考内容格式 自行搭建。
  ];
  
  let DLS = 4;//速度下限
  let addressescsv = [
	//'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv' //iptest测速结果文件。
  ];
  
  let subconverter = "api.v1.mk"; //在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
  let subconfig = "https://raw.githubusercontent.com/cmliu/edgetunnel/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"; //订阅配置文件

  let link = '';
  let edgetunnel = 'ed';
  let RproxyIP = 'false';
  let proxyIPs = [
	'cdn.xn--b6gac.eu.org',
	'cdn-all.xn--b6gac.eu.org',
	'edgetunnel.anycast.eu.org',
  ];
  let CMproxyIPs = [
	//{ proxyIP: "proxyip.fxxk.dedyn.io", type: "US" },
	//{ proxyIP: "proxyip.sg.fxxk.dedyn.io", type: "SG" },
  ];
  let BotToken ='';
  let ChatID =''; 
  let proxyhosts = [ 
    	'fc071d49-af91-42d6-a20e-5a64e24a53bc.71a45835-dd0c-4d51-8bd4-9ccf9f223662.casacam.net',
	'68123106-3e43-4958-b75a-b06e81eabf79.50d88e28-a870-497d-bf87-c20fb6802871.camdvr.org',
	'30388d70-6f5c-4d7c-8daa-9d3df7c5c526.9150e878-8296-4798-a172-c3fe66b8dee5.ddnsgeek.com',
	'ca3ff542-1cef-4e11-8fe2-edf0be054938.ee137666-1e0a-46db-bbd6-cc18f9841234.accesscam.org',
	'45c6457b-17f3-403d-bb15-9bfb4718964a.71a45835-dd0c-4d51-8bd4-9ccf9f223662.casacam.net',
	'32402ac4-000d-4d4b-81cb-8d360cb770b1.50d88e28-a870-497d-bf87-c20fb6802871.camdvr.org',
	'1e84f9b8-ceb1-47fc-9c10-634201bd9959.9150e878-8296-4798-a172-c3fe66b8dee5.ddnsgeek.com',
	'15212712-20f5-40a5-b9aa-8363e0130171.ee137666-1e0a-46db-bbd6-cc18f9841234.accesscam.org',
	'478a9f2a-0d66-4035-a797-06e9c83c6739.3869fe04-6fcd-4ad4-a8f4-40582f4fa0c4.giize.com',
	'e8b99cbe-9ebd-4a20-a497-38f4b29f2c98.83b11782-ecae-411f-90c3-2a01bb33260a.gleeze.com',
	'fe9b5676-a2aa-4b6a-8257-cd2dd0910205.8c98ef2b-bee2-470b-b759-9f5efbc10812.freeddns.org',
	'159d770e-fd74-4069-a73b-fe6ececa7951.f82aee4c-752c-4b0c-9793-380d4d76435c.ddnsgeek.com',
  ];
  let EndPS = '';
  async function getAddressesapi() {
	  if (!addressesapi || addressesapi.length === 0) {
		return [];
	  }
	
	  let newAddressesapi = [];
	
	  for (const apiUrl of addressesapi) {
		try {
		  const response = await fetch(apiUrl);
	
		  if (!response.ok) {
			console.error('获取地址时出错:', response.status, response.statusText);
			continue;
		  }
	
		  const text = await response.text();
		  const lines = text.split('\n');
		  const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(#.*)?$/;
	
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
	
	  return newAddressesapi;
  }
  
  async function getAddressescsv() {
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
	
		  const text = await response.text();  // 使用正确的字符编码解析文本内容
		  const lines = text.split('\n');
	
		  // 检查CSV头部是否包含必需字段
		  const header = lines[0].split(',');
		  const tlsIndex = header.indexOf('TLS');
		  const speedIndex = header.length - 1; // 最后一个字段
	
		  const ipAddressIndex = 0;  // IP地址在 CSV 头部的位置
		  const portIndex = 1;  // 端口在 CSV 头部的位置
		  const dataCenterIndex = tlsIndex + 1; // 数据中心是 TLS 的后一个字段
	
		  if (tlsIndex === -1) {
			console.error('CSV文件缺少必需的字段');
			continue;
		  }
	
		  // 从第二行开始遍历CSV行
		  for (let i = 1; i < lines.length; i++) {
			const columns = lines[i].split(',');
	
			// 检查TLS是否为"TRUE"且速度大于DLS
			if (columns[tlsIndex].toUpperCase() === 'TRUE' && parseFloat(columns[speedIndex]) > DLS) {
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

  let protocol;
  async function handleRequest(request) {
	const userAgentHeader = request.headers.get('User-Agent');
	const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
	const url = new URL(request.url);
	let host = "";
	let uuid = "";
	let path = "";

	if (url.pathname.includes("/auto") || url.pathname.includes("/404") || url.pathname.includes("/sos")) {
		host = "cmliussss.pages.dev";
		uuid = "30e9c5c8-ed28-4cd9-b008-dc67277f8b02";
		path = "/?ed=2048";
		//edgetunnel = 'cmliu';
		//RproxyIP = 'true';
	
	await sendMessage("#获取订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
	} else if (url.pathname.includes("/lunzi")) {
		let sites = [
			{ url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/xray/config.json',type: "xray"},
			{ url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/xray/1/config.json',type: "xray" },
			{ url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/xray/2/config.json',type: "xray"},
			{ url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/xray/3/config.json',type: "xray"},
			{ url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/config.json',type: "xray"},
			{ url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/2/config.json',type: "xray"},
		];

		const maxRetries = 6;
		let retryCount = 0;
		let data = null;

		while (retryCount < maxRetries) {
		  const randomSite = sites[Math.floor(Math.random() * sites.length)];
		  const response = await fetch(randomSite.url);

			if (response.ok) {
				data = await response.json();
				if (!data) {
					console.error('Failed to fetch data after multiple retries.');
					// 这里你可以选择如何处理失败，比如返回错误响应或执行其他逻辑
					return new Response('Failed to fetch data after multiple retries.', {
					status: 500,
					headers: { 'content-type': 'text/plain; charset=utf-8' },
					});
				}
			
				processXray(data);
			
				function processXray(data) {
					let outboundConfig = data.outbounds[0];
					host = outboundConfig?.streamSettings?.wsSettings?.headers?.Host;
					uuid = outboundConfig.settings?.vnext?.[0]?.users?.[0]?.id;
					path = outboundConfig?.streamSettings?.wsSettings?.path;
					protocol = outboundConfig.protocol;
				}

				if (protocol.toLowerCase() === 'vless') {
					break; // 成功获取数据时跳出循环
				}
			} else {
				console.error('Failed to fetch data. Retrying...');
				retryCount++;
			}
		}

        const hy2Url = "https://hy2.ssrc.cf";

        try {
            const subconverterResponse = await fetch(hy2Url);

            if (!subconverterResponse.ok) {
                throw new Error(`Error fetching lzUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
            }

            const base64Text = await subconverterResponse.text();
            link = atob(base64Text); // 进行 Base64 解码

        } catch (error) {
            // 错误处理
        }

	} else {
		host = url.searchParams.get('host');
		uuid = url.searchParams.get('uuid');
		path = url.searchParams.get('path');
		
		if (!url.pathname.includes("/sub")) {
			const workerUrl = url.origin + url.pathname;
			const responseText = `
		路径必须包含 "/sub"
		The path must contain "/sub"
		مسیر باید شامل "/sub" باشد
		
		${workerUrl}sub?host=[your host]&uuid=[your uuid]&path=[your path]
		
		
		
		
		
		
			
			https://github.com/cmliu/WorkerVless2sub
			`;
		
			return new Response(responseText, {
			  status: 400,
			  headers: { 'content-type': 'text/plain; charset=utf-8' },
			});
		  }
		
		  if (!host || !uuid) {
			const workerUrl = url.origin + url.pathname;
			const responseText = `
		缺少必填参数：host 和 uuid
		Missing required parameters: host and uuid
		پارامترهای ضروری وارد نشده: هاست و یوآی‌دی
		
		${workerUrl}?host=[your host]&uuid=[your uuid]&path=[your path]
		
		
		
		
		
		
			
			https://github.com/cmliu/WorkerVless2sub
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
			headers: { 'content-type': 'text/plain; charset=utf-8' },
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
			headers: { 'content-type': 'text/plain; charset=utf-8' },
		  });
		} catch (error) {
		  return new Response(`Error: ${error.message}`, {
			status: 500,
			headers: { 'content-type': 'text/plain; charset=utf-8' },
		  });
		}
	} else {
		const newAddressesapi = await getAddressesapi();
		const newAddressescsv = await getAddressescsv();
		addresses = addresses.concat(newAddressesapi);
		addresses = addresses.concat(newAddressescsv);
	
	  // 使用Set对象去重
	  const uniqueAddresses = [...new Set(addresses)];
	
	  const responseBody = uniqueAddresses.map(address => {
		let port = "8443";
		let addressid = address;
	
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
		
		edgetunnel = url.searchParams.get('edgetunnel') || edgetunnel;
		RproxyIP = url.searchParams.get('proxyip') || RproxyIP;
		if (edgetunnel.trim() === 'cmliu' && RproxyIP.trim() === 'true') {
			// 将addressid转换为小写
			let lowerAddressid = addressid.toLowerCase();
			// 初始化找到的proxyIP为null
			let foundProxyIP = null;

			// 遍历CMproxyIPs数组查找匹配项
			for (let item of CMproxyIPs) {
				if (lowerAddressid.includes(item.type.toLowerCase())) {
				foundProxyIP = item.proxyIP;
				break; // 找到匹配项，跳出循环
				}
			}

			if (foundProxyIP) {
				// 如果找到匹配的proxyIP，赋值给path
				path = `/proxyIP=${foundProxyIP}`;
			} else {
				// 如果没有找到匹配项，随机选择一个proxyIP
				const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
				path = `/proxyIP=${randomProxyIP}`;
			}
		}
		  
		let 最终路径 = path ;
		if(url.searchParams.get('host') && url.searchParams.get('host').includes('workers.dev')) {
			最终路径 = `/${url.searchParams.get('host')}${path}`;
			host = proxyhosts[Math.floor(Math.random() * proxyhosts.length)];
			EndPS = ' 已启用临时域名中转服务,请尽快绑定自定义域!';
		}
		const vlessLink = `vless://${uuid}@${address}:${port}?encryption=none&security=tls&sni=${host}&fp=random&type=ws&host=${host}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + EndPS)}`;
	
		return vlessLink;
	  }).join('\n');
	
	  const combinedContent = responseBody + '\n' + link; // 合并内容
	  const base64Response = btoa(combinedContent); // 重新进行 Base64 编码
  
	  const response = new Response(base64Response, {
		  headers: { 'content-type': 'text/plain' },
	  });
  
	  return response;
	}
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
