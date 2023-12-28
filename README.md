# WorkerVless2sub
### 这个是一个将 Cloudflare Workers - VLESS 搭配 自建优选域名 的 订阅生成器
此 Cloudflare Workers 脚本根据指定的首选项和额外的动态地址生成 VLESS 订阅链接。它提供了一种简便的方式来设置具有首选地址的 VLESS 订阅，并支持从 API 获取额外的地址。

## 使用方法
要使用此 Cloudflare Workers，请按照以下步骤进行：

在您的 Cloudflare 帐户上部署 [worker.js](https://github.com/cmliu/WorkerVless2sub/blob/main/worker.js) 脚本。
配置您的 VLESS 客户端以使用生成的订阅链接。

## 参数
该脚本支持以下参数：

**host**：您的 VLESS 服务器主机名。

**uuid**：您的 VLESS 客户端 UUID。

**path**（可选）：您的 VLESS 的 WS 路径（没有可留空不填）。

## 路径要求
路径必须包含 "/sub"。例如：

```lua
https://[YOUR-WORKER-URL]/sub?host=[YOUR-HOST]&uuid=[YOUR-UUID]&path=[YOUR-PATH]
```
用您实际的值替换占位符，如 **YOUR-WORKER-URL**、**YOUR-HOST** 和 **YOUR-UUID**，**YOUR-PATH**为空可不填。此外，根据您的具体用例考虑添加更多详细信息或自定义。

### 设置你的专属优选域名
请自行修改添加 **addresses** 参数即可，若不带端口号默认443，不支持生成非TLS订阅
```js
let addresses = [
  'www.visa.com.hk:2096',
  'icook.tw:2053',
  'what.the.fuck.cloudns.biz'
];
```

### 获取额外优选地址
脚本允许从 API 获取额外的地址。在脚本中设置 addressesapi 变量为 **优选地址API接口** 的 URL。
```js
let addressesapi = 'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt'; //该接口只是示例，并不进行维护。
```

## 示例
### 请求
```lua
https://sub.fxxk.dedyn.io/sub?host=www.google.com&uuid=bbcd7623-bae1-4513-b177-f17f9c244327&path=ws
```

### 响应
响应将是一个 Base64 编码的 VLESS 订阅链接：

```makefile
dmxlc3M6Ly95b3VyLWhvc3Q9eXlvdXIuaG9zdDpkb2N0OjQ0My9lZG=...
```

## 感谢
我自己的脑洞


