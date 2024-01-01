addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 设置优选地址，不带端口号默认443，不支持非TLS订阅生成
let addresses = [
  'www.visa.com.hk:2096',
  'icook.tw:2053',
  'cloudflare.cfgo.cc'
];

// 设置优选地址api接口
let addressesapi = '';
// let addressesapi = 'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt'; //可参考内容格式 自行搭建。

async function getAddresses() {
  if (!addressesapi || addressesapi.trim() === '') {
    return [];
  }

  try {
    const response = await fetch(addressesapi);

    // 如果响应状态码不为 200 OK，直接跳过返回空数组
    if (!response.ok) {
      console.error('获取地址时出错:', response.status, response.statusText);
      return [];
    }

    const text = await response.text();
    const lines = text.split('\n');

    // 正则表达式用于匹配IPv4地址和端口号
    const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(#\w+)?$/;

    // 使用map函数处理每一行，只保留符合正则表达式的部分
    const addresses = lines.map(line => {
      const match = line.match(regex);
      return match ? match[0] : null;
    }).filter(Boolean);  // 使用filter(Boolean)来移除null值

    return addresses;
  } catch (error) {
    console.error('获取地址时出错:', error);
    return [];
  }
}

async function handleRequest(request) {
  // 解析查询参数
  const url = new URL(request.url);
  const host = url.searchParams.get('host');
  const uuid = url.searchParams.get('uuid');
  let path = url.searchParams.get('path');

  // 检查路径是否包含 "/sub"
  if (!url.pathname.includes("/sub")) {
    const workerUrl = url.origin + url.pathname;
    const responseText = `
路径必须包含 "/sub"
The path must contain "/sub"
مسیر باید شامل "/sub" باشد

${workerUrl}sub?host=[your host]&uuid=[your uuid]&path=[your path]
    `;

    return new Response(responseText, {
      status: 400,
      headers: { 'content-type': 'text/plain; charset=utf-8'  },
    });
  }

  // 检查参数是否缺失
  if (!host || !uuid) {
    const workerUrl = url.origin + url.pathname;
    const responseText = `
缺少必填参数：host 和 uuid
Missing required parameters: host and uuid
پارامترهای ضروری وارد نشده: هاست و یوآی‌دی

${workerUrl}?host=[your host]&uuid=[your uuid]&path=[your path]
    `;

    return new Response(responseText, {
      status: 400,
      headers: { 'content-type': 'text/plain; charset=utf-8'  },
    });
  }

  // 如果path缺失或为空，设置默认值
  if (!path || path.trim() === '') {
    path = encodeURIComponent('/?ed=2048');
  } else {
    path = encodeURIComponent(path);
  }

// 获取新的地址
const newAddresses = await getAddresses();
addresses = addresses.concat(newAddresses);

// 构建响应内容
const responseBody = addresses.map(address => {
  let port = "443";
  let addressid = address;

  // 检查地址中是否包含冒号和井号
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

  // 如果addressid包含冒号，只保留冒号前的内容
  if (addressid.includes(':')) {
    addressid = addressid.split(':')[0];
  }

  // 构建vless链接
  const vlessLink = `vless://${uuid}@${address}:${port}?encryption=none&security=tls&sni=${host}&fp=random&type=ws&host=${host}&path=${path}#${addressid}`;

  return vlessLink;
}).join('\n');

  // Base64 编码整个响应内容
  const base64Response = btoa(responseBody);

  // 构建Response对象
  const response = new Response(base64Response, {
    headers: { 'content-type': 'text/plain' },
  });

  return response;
}
