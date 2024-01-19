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
  
  let DLS = 4;
  let addressescsv = [
	'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv'
  ];
  
  let subconverter = "api.v1.mk"; //在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
  let subconfig = "https://raw.githubusercontent.com/cmliu/edgetunnel/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"; //订阅配置文件

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
  
  async function handleRequest(request) {
	const userAgent = request.headers.get('User-Agent').toLowerCase();
	const url = new URL(request.url);
	let host = "";
	let uuid = "";
	let path = "";
  
	if (url.pathname.includes("/auto") || url.pathname.includes("/404") || url.pathname.includes("/sos")) {
		host = "cmliussss.pages.dev";
		uuid = "30e9c5c8-ed28-4cd9-b008-dc67277f8b02";
		path = "/?ed=2048";

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
			break; // 成功获取数据时跳出循环
		  } else {
			console.error('Failed to fetch data. Retrying...');
			retryCount++;
		  }
		}
	
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
			path = encodeURIComponent('/?ed=2048');
		  } else {
			// 如果第一个字符不是斜杠，则在前面添加一个斜杠
			path = (path[0] === '/') ? encodeURIComponent(path) : encodeURIComponent('/' + path);
		  }
	}
  
	if (userAgent.includes('clash')) {
		const subconverterUrl = `https://${subconverter}/sub?target=clash&url=${encodeURIComponent(url.origin + url.pathname)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

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
		const subconverterUrl = `https://${subconverter}/sub?target=singbox&url=${encodeURIComponent(url.origin + url.pathname)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

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
	
		const vlessLink = `vless://${uuid}@${address}:${port}?encryption=none&security=tls&sni=${host}&fp=random&type=ws&host=${host}&path=${path}#${encodeURIComponent(addressid)}`;
	
		return vlessLink;
	  }).join('\n');
	
	  const base64Response = btoa(responseBody);
	
	  const response = new Response(base64Response, {
		headers: { 'content-type': 'text/plain' },
	  });
	
	  return response;
	}

	
  }
