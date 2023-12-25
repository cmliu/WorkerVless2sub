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
    return text.split('\n');
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
    // 检查地址中是否包含冒号，补充 ":443"
    if (!address.includes(':')) {
      address += ':443';
    }

    // 提取 addressid
    const addressid = address.split(':')[0];

    // 构建vless链接
    const vlessLink = `vless://${uuid}@${address}?encryption=none&security=tls&sni=${host}&fp=random&type=ws&host=${host}&path=${path}#${addressid}`;

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
