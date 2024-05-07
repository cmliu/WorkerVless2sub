# 优选订阅生成器 WorkerVless2sub

### 这个是一个通过 Cloudflare Workers 搭建，自动生成优选线路 VLESS 节点订阅内容生成器 [[实现原理]](https://www.youtube.com/watch?v=p-KhFJAC4WQ&t=70s)

Telegram交流群：[@CMLiussss](https://t.me/CMLiussss)

# Pages 部署方法 [视频教程](https://www.youtube.com/watch?v=p-KhFJAC4WQ&t=509s)

### 1. 部署 Cloudflare Pages：
   - 在 Github 上先 Fork 本项目，并点上 Star !!!
   - 在 Cloudflare Pages 控制台中选择 `连接到 Git`后，选中 `WorkerVless2sub`项目后点击 `开始设置`。
     
### 2. 给 Pages绑定 自定义域：
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `fuck.cloudns.biz`，则添加自定义域填入 `sub.fuck.cloudns.biz`即可；
   - 按照 Cloudflare 的要求将返回你的域名DNS服务商，添加 该自定义域 `sub`的 CNAME记录 `WorkerVless2sub.pages.dev` 后，点击 `激活域`即可。

### 3. 修改 快速订阅入口 以及 添加内置 Vless 节点信息：

  例如您的pages项目域名为：`sub.fuck.cloudns.biz`；
   - 添加 `TOKEN` 变量，快速订阅访问入口，默认值为: `auto` ，获取订阅器默认节点订阅地址即 `/auto` ，例如 `https://sub.fuck.cloudns.biz/auto`
   - 添加 `HOST` 变量，例如 `edgetunnel-2z2.pages.dev`；
   - 添加 `UUID` 变量，例如 `30e9c5c8-ed28-4cd9-b008-dc67277f8b02`；
   - 添加 `PATH` 变量，例如 `/?ed=2048`；

### 4. 添加你的专属优选线路：

   - 添加变量 `ADD`/`ADDNOTLS` 本地静态的优选线路，若不带端口号 TLS默认端口为443 / noTLS默认端口为80，#号后为备注别名，例如：
   ```
   icook.tw:2053#优选域名
   cloudflare.cfgo.cc#优选官方线路
   ```

   - 添加变量 `ADDAPI`/`ADDNOTLSAPI` 为 **优选IP地址txt文件** 的 URL。例如：
   ```url
   https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt
   https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesipv6api.txt
   ```

<details>
<summary><code><strong>「 我不是小白！我有IP库！我知道IPtest是什么！我也有csv测速文件！ 」</strong></code></summary>

   - 添加变量 `ADDCSV` 为 **iptest测速结果csv文件地址** 的 URL。例如：
   ```js
   https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv
   ```
   - 添加变量 `DLS` ，意为`ADDCSV`满足最低速度的要求，不满足改数值以上的IP将不会添加至优选订阅内容。注意：不考虑单位，只看数值，请按照您的测速结果而定。例如：
   ```js
   8
   ```

 </details>

# Workers 部署方法 [视频教程](https://youtu.be/AtCF7eq0hcE)

### 1. 部署 Cloudflare Worker：

   - 在 Cloudflare Worker 控制台中创建一个新的 Worker。
   - 将 [worker.js](https://github.com/cmliu/WorkerVless2sub/blob/main/_worker.js)  的内容粘贴到 Worker 编辑器中。


### 2. 修改 快速订阅入口 以及 添加内置 Vless 节点信息：

  例如您的workers项目域名为：`sub.cmliussss.workers.dev`；
   - 添加 `TOKEN` 变量，快速订阅访问入口，默认值为: `auto` ，获取订阅器默认节点订阅地址即 `/auto` ，例如 `https://sub.cmliussss.workers.dev/auto`
   - 添加 `HOST` 变量，例如 `edgetunnel-2z2.pages.dev`；
   - 添加 `UUID` 变量，例如 `30e9c5c8-ed28-4cd9-b008-dc67277f8b02`；
   - 添加 `PATH` 变量，例如 `/?ed=2048`；


### 3. 添加你的专属优选线路：

**3.1 修改 addresses 参数示例**

 - 修改 `addresses` 参数添加本地静态的优选线路，若不带端口号默认443，不支持生成非TLS订阅，#号后为备注别名，例如：
	```js
	let addresses = [
		'icook.tw:2053#优选域名',
		'cloudflare.cfgo.cc#优选官方线路',
		'185.221.160.203:443#电信优选IP',
	];
	```
	该方式仅推荐添加优选域名的部分，频繁变更的优选推荐通过 `addressesapi` 来实现。


 **3.2 修改 addressesapi 参数示例**
 
 - 修改 `addressesapi` 参数，在脚本中设置 `addressesapi` 变量为 **优选IP地址txt文件** 的 URL。例如：
	```js
	let addressesapi = [
		'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt',
 		'https://addressesapi.090227.xyz/CloudFlareYes',
	];
	```
	可参考 [addressesapi.txt](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt) 内容格式 自行搭建。


<details>
<summary><code><strong>「 我不是小白！我有IP库！我知道IPtest是什么！我也有csv测速文件！ 」</strong></code></summary>

 
  **3.3 修改 addressescsv 参数示例**
  
 - 修改 `addressescsv` 参数，在脚本中设置 `addressescsv` 变量为 **iptest测速结果csv文件地址** 的 URL。例如：
	```js
	let DLS = 4;//速度下限
	let addressescsv = [
		'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv',
 		'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv',
	];
	```
	`DLS` 为要求满足的最低速度，不满足改数值以上的IP将不会添加至优选订阅内容。注意：不考虑单位，只看数值，请按照您的测速结果而定。

 </details>



# 订阅生成器 使用方法 [视频教程](https://youtu.be/OjqCKeEY7DQ)

  例如您的workers项目域名为：`sub.cmliussss.workers.dev`；
  
### 1. 快速订阅

   - 添加 `TOKEN` 变量，快速订阅访问入口，默认值为: `auto` ，获取订阅器默认节点订阅地址即 `/auto` ，例如：
     ```url
     https://sub.cmliussss.workers.dev/auto
     ```
     
### 2. 自定义订阅 

   - **自定义订阅格式** `https://[你的Workers域名]/sub?host=[你的Vless域名]&uuid=[你的UUID]&path=[你的ws路径]`
   - **host**：您的 VLESS 伪装域名，例如 `edgetunnel-2z2.pages.dev`；
   - **uuid**：您的 VLESS 客户端 UUID，例如 `30e9c5c8-ed28-4cd9-b008-dc67277f8b02`；
   - **path**（可选）：您的 VLESS 的 WS 路径（没有可留空不填），例如 `/?ed=2048`。
   - 自定义订阅地址如下：
     ```url
     https://sub.cmliussss.workers.dev/sub?host=edgetunnel-2z2.pages.dev&uuid=30e9c5c8-ed28-4cd9-b008-dc67277f8b02&path=/?ed=2048
     ```
   - 注意路径必须包含 "/sub"。

### 3. 指定 clash、singbox 配置文件

   - 添加 `format=clash` 键值，获取 clash 订阅配置，例如：
     ```url
     https://sub.cmliussss.workers.dev/auto?format=clash
     https://sub.cmliussss.workers.dev/sub?format=clash&host=edgetunnel-2z2.pages.dev&uuid=30e9c5c8-ed28-4cd9-b008-dc67277f8b02&path=/?ed=2048
     ```
     
   - 添加 `format=singbox` 键值，获取 singbox 订阅配置，例如：
     ```url
     https://sub.cmliussss.workers.dev/auto?format=singbox
     https://sub.cmliussss.workers.dev/sub?format=singbox&host=edgetunnel-2z2.pages.dev&uuid=30e9c5c8-ed28-4cd9-b008-dc67277f8b02&path=/?ed=2048
     ```
     
### 变量说明
| 变量名 | 示例 | 备注 | 
|--------|---------|-----|
| TOKEN | auto | 快速订阅内置节点的订阅路径地址 /auto (支持多元素, 元素之间使用`,`作间隔)| 
| HOST | edgetunnel-2z2.pages.dev | 快速订阅内置节点的伪装域名 | 
| UUID | b7a392e2-4ef0-4496-90bc-1c37bb234904 | 快速订阅内置节点的UUID | 
| PATH | /?ed=2560 | 快速订阅内置节点的路径信息 | 
| ADD | icook.tw:2053#官方优选域名 | 对应`addresses`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| ADDAPI | [https://raw.github.../addressesapi.txt](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt) | 对应`addressesapi`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| ADDNOTLS | icook.hk:8080#官方优选域名 | 对应`addressesnotls`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| ADDNOTLSAPI | [https://raw.github.../addressesapi.txt](https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/addressesapi.txt) | 对应`addressesnotlsapi`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| ADDCSV | [https://raw.github.../addressescsv.csv](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv) | 对应`addressescsv`字段 (支持多元素, 元素之间使用`,`作间隔) | 
| DLS | 8 |`addressescsv`测速结果满足速度下限 | 
| NOTLS | false | 改为`true`, 将不做域名判断 始终返回noTLS节点 | 
| TGTOKEN | 6894123456:XXXXXXXXXX0qExVsBPUhHDAbXXXXXqWXgBA | 发送TG通知的机器人token | 
| TGID | 6946912345 | 接收TG通知的账户数字ID | 
| SUBAPI | api.v1.mk | clash、singbox等 订阅转换后端 | 
| SUBCONFIG | [https://raw.github.../ACL4SSR_Online_Full_MultiMode.ini](https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) | clash、singbox等 订阅转换配置文件 | 
| SUBNAME | WorkerVless2sub | 订阅生成器名称 | 
| PS | 【请勿测速】 | 节点名备注消息 | 
| PROXYIP | proxyip.fxxk.dedyn.io | 默认分配的ProxyIP, 多ProxyIP将随机分配(支持多元素, 元素之间使用`,`作间隔) | 
| CMPROXYIPS | proxyip.aliyun.fxxk.dedyn.io:HK | 识别HK后分配对应的ProxyIP(支持多元素, 元素之间使用`,`作间隔) | 

## Star 星星走起
[![Stargazers over time](https://starchart.cc/cmliu/WorkerVless2sub.svg?variant=adaptive)](https://starchart.cc/cmliu/WorkerVless2sub)

# 感谢
我自己的脑洞，[SAKURA-YUMI](https://github.com/SAKURA-YUMI)，[EzSync](https://github.com/EzSync)、[ACL4SSR](https://github.com/ACL4SSR/ACL4SSR/tree/master/Clash/config)、[肥羊](https://github.com/youshandefeiyang/sub-web-modify)


