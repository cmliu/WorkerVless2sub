# تولید کننده اشتراک Cloudflare Workers همراه با VLESS و دامنه اختصاصی

سلام بچه‌ها! خوبین؟ امیدوارم حالتون خوب باشه. می‌خوام یه چیز باحال بهتون معرفی کنم. یه ابزار خفن ساختم که با Cloudflare Workers کار می‌کنه و خودش اشتراک‌های VLESS و Trojan رو با بهترین خط‌ها درست می‌کنه. اگه می‌خواین بدونین چطوری کار می‌کنه، یه ویدیو گذاشتم، می‌تونین [اینجا](https://www.youtube.com/watch?v=p-KhFJAC4WQ&t=70s) ببینینش.

راستی، اگه دوست دارین با بقیه در موردش حرف بزنین، بیاین تو گروه تلگراممون: [@CMLiussss](https://t.me/CMLiussss). یه تشکر ویژه هم از [Alice Networks](https://alice.ws/aff.php?aff=15) دارم که سرور ابری رو برای [سرویس تبدیل اشتراک CM](https://sub.fxxk.dedyn.io/) فراهم کرده. دمشون گرم!

# چجوری روی Pages راه‌اندازیش کنیم؟

خب، اول یه [آموزش ویدیویی](https://www.youtube.com/watch?v=p-KhFJAC4WQ&t=509s) براتون گذاشتم. ولی اگه حوصله ویدیو دیدن ندارین، اینجا قدم به قدم براتون توضیح می‌دم:

### 1. نصبش کنیم روی Cloudflare Pages:
   - اول برین تو گیت‌هاب و این پروژه رو فورک کنین. یادتون نره بهش یه ستاره هم بدین، خوشحالم می‌کنین!
   - بعدش برین تو داشبورد Cloudflare Pages و روی "اتصال به Git" کلیک کنین. پروژه `WorkerVless2sub` رو پیدا کنین و "شروع تنظیمات" رو بزنین.
     
### 2. یه دامنه اختصاصی بهش بدیم:
   - تو همون داشبورد Pages، برین سراغ "دامنه‌های سفارشی" و "تنظیم دامنه سفارشی" رو بزنین.
   - یه ساب‌دامین بهش بدین. مثلاً اگه دامینتون `fuck.cloudns.biz` هست، بنویسین `sub.fuck.cloudns.biz`.
   - حالا برین تو تنظیمات DNS دامینتون و یه رکورد CNAME برای ساب‌دامین `sub` به `WorkerVless2sub.pages.dev` اضافه کنین. بعدش برگردین و "فعال‌سازی دامنه" رو بزنین.

### 3. حالا وقتشه تنظیمات اصلی رو انجام بدیم:

  فرض کنیم آدرس پروژه Pages شما `sub.fuck.cloudns.biz` شده:
   - یه متغیر `TOKEN` اضافه کنین. مقدار پیش‌فرضش `auto` هست. این میشه آدرس سریع اشتراکتون، مثلاً `https://sub.fuck.cloudns.biz/auto`
   - یه متغیر `HOST` اضافه کنین، مثلاً `edgetunnel-2z2.pages.dev`
   - یه متغیر `UUID` هم اضافه کنین، مثلاً `30e9c5c8-ed28-4cd9-b008-dc67277f8b02`
   - و در آخر، یه متغیر `PATH` اضافه کنین، مثلاً `/?ed=2048`

### 4. خط‌های بهینه شخصی خودتون رو اضافه کنین:

   - متغیرهای `ADD` و `ADDNOTLS` رو برای خط‌های بهینه ثابت اضافه کنین. اگه پورت نذارین، واسه TLS از 443 و واسه noTLS از 80 استفاده می‌کنه. بعد از # هم می‌تونین یه توضیح کوچیک بذارین. مثلاً:
```
icook.tw:2053#دامنه خفن
cloudflare.cfgo.cc#خط رسمی توپ
```

   - متغیرهای `ADDAPI` و `ADDNOTLSAPI` رو هم برای URL فایل‌های txt که آدرس‌های IP بهینه توشونه اضافه کنین. مثلاً:
```url
https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt
https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesipv6api.txt
```

<details>
<summary><code><strong>«من حرفه‌ای‌ام! پایگاه IP دارم! IPtest رو می‌شناسم! فایل csv تست سرعت هم دارم!»</strong></code></summary>

اوکی داداش، پس بذار اینا رو هم بهت بگم:

   - یه متغیر `ADDCSV` اضافه کن واسه URL فایل csv که نتایج تست سرعت iptest توشه. مثلاً:
```js
https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv
```
   - یه متغیر `DLS` هم بذار که مشخص کنه حداقل سرعت قابل قبول واسه `ADDCSV` چقدره. IP‌هایی که از این کندترن به لیست اشتراک بهینه اضافه نمیشن. فقط عدد بنویس، واحد مهم نیست. مثلاً:
```js
8
```

</details>

# چجوری روی Workers راه‌اندازیش کنیم؟

یه [آموزش ویدیویی](https://youtu.be/AtCF7eq0hcE) هم واسه این گذاشتم. ولی اگه ترجیح میدی بخونی، اینم توضیحاتش:

### 1. بذاریمش رو Cloudflare Worker:

   - برو تو داشبورد Cloudflare Worker و یه Worker جدید بساز.
   - محتوای [worker.js](https://github.com/cmliu/WorkerVless2sub/blob/main/_worker.js) رو کپی کن و تو ویرایشگر Worker بچسبون.

### 2. تنظیمات اصلی رو انجام بدیم:

  فرض کنیم دامنه پروژه Workers شما `sub.cmliussss.workers.dev` شده:
   - یه متغیر `TOKEN` بساز. مقدار پیش‌فرضش `auto` هست. این میشه آدرس سریع اشتراکت، مثلاً `https://sub.cmliussss.workers.dev/auto`
   - یه متغیر `HOST` بساز، مثلاً `edgetunnel-2z2.pages.dev`
   - یه متغیر `UUID` هم بساز، مثلاً `30e9c5c8-ed28-4cd9-b008-dc67277f8b02`
   - و یه متغیر `PATH` بساز، مثلاً `/?ed=2048`

### 3. خط‌های بهینه شخصی خودت رو اضافه کن:

**3.1 تغییر پارامتر addresses**

 - پارامتر `addresses` رو واسه اضافه کردن خط‌های بهینه ثابت تغییر بده. اگه پورت ننویسی، از 443 استفاده می‌کنه. فعلاً نمی‌تونی اشتراک غیر TLS بسازی. بعد از # هم می‌تونی توضیح بذاری. مثلاً:
```js
let addresses = [
'icook.tw:2053#دامنه خفن',
'cloudflare.cfgo.cc#خط رسمی توپ',
'185.221.160.203:443#IP بهینه تلکام',
];
```
    این روش بیشتر واسه دامنه‌های بهینه خوبه. واسه بهینه‌هایی که زیاد عوض میشن، بهتره از `addressesapi` استفاده کنی.

**3.2 تغییر پارامتر addressesapi**
 
 - پارامتر `addressesapi` رو تغییر بده و URL فایل txt که آدرس‌های IP بهینه توشه رو بهش بده. مثلاً:
```js
let addressesapi = [
'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt',
'https://addressesapi.090227.xyz/CloudFlareYes',
];
```
    می‌تونی از [addressesapi.txt](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt) الگو بگیری و یکی واسه خودت بسازی.

<details>
<summary><code><strong>«من حرفه‌ای‌ام! پایگاه IP دارم! IPtest رو می‌شناسم! فایل csv تست سرعت هم دارم!»</strong></code></summary>

 
  **3.3 تغییر پارامتر addressescsv**
  
 - پارامتر `addressescsv` رو تغییر بده و URL فایل csv که نتایج تست سرعت iptest توشه رو بهش بده. مثلاً:
```js
let DLS = 4;//حداقل سرعت
let addressescsv = [
'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv',
'https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv',
];
```
`DLS` حداقل سرعت قابل قبول رو مشخص می‌کنه. IP‌هایی که از این کندترن به لیست اشتراک بهینه اضافه نمیشن. فقط عدد بنویس، واحد مهم نیست. خودت با توجه به نتایج تست سرعتت تنظیمش کن.

</details>
# چجوری از این ابزار استفاده کنیم؟

یه [آموزش ویدیویی](https://youtu.be/OjqCKeEY7DQ) هم واسه این گذاشتم. ولی اگه ترجیح میدی بخونی، بفرما:

فرض کنیم دامنه پروژه Workers شما `sub.cmliussss.workers.dev` شده:
  
## 1. اشتراک سریع

   - یه متغیر `TOKEN` بساز. مقدار پیش‌فرضش `auto` هست. این میشه آدرس سریع اشتراکت `/auto`. مثلاً:
```url
https://sub.cmliussss.workers.dev/auto
```
     
## 2. اشتراک سفارشی 
### اشتراک VLESS
   - **فرمت اشتراک سفارشی** اینجوریه: `https://[دامنه Workers شما]/sub?host=[دامنه Vless شما]&uuid=[UUID شما]&path=[مسیر ws شما]`
- **host**: دامنه مخفی VLESS شما، مثلاً `edgetunnel-2z2.pages.dev`
- **uuid**: UUID کلاینت VLESS شما، مثلاً `30e9c5c8-ed28-4cd9-b008-dc67277f8b02`
- **path** (اختیاری): مسیر VLESS شما (اگه نداری خالی بذار)، مثلاً `/?ed=2560`
- **sni** (اختیاری): SNI VLESS شما (اگه خالی باشه از همون `host` استفاده میکنه)، مثلاً `www.10068.cn`
- **type** (اختیاری): پروتکل انتقال VLESS شما (اگه خالی باشه از `ws` استفاده میکنه)، مثلاً `splithttp`
   - آدرس اشتراک سفارشیت اینجوری میشه:
```url
https://sub.cmliussss.workers.dev/sub?host=edgetunnel-2z2.pages.dev&uuid=30e9c5c8-ed28-4cd9-b008-dc67277f8b02&path=/?ed=2560&sni=www.10068.cn&type=splithttp
```
   - یادت باشه که مسیر حتماً باید "/sub" داشته باشه.

### اشتراک Trojan
   - **فرمت اشتراک سفارشی** اینجوریه: `https://[دامنه Workers شما]/sub?host=[دامنه Trojan شما]&pw=[رمز عبور شما]&path=[مسیر ws شما]`
- **host**: دامنه مخفی Trojan شما، مثلاً `hbpb.us.kg`
- **pw**: رمز عبور کلاینت Trojan شما، مثلاً `bpb-trojan`
- **path** (اختیاری): مسیر Trojan شما (اگه نداری خالی بذار)، مثلاً `/tr?ed=2560`
- **sni** (اختیاری): SNI Trojan شما (اگه خالی باشه از همون `host` استفاده میکنه)، مثلاً `www.10068.cn`
- **type** (اختیاری): پروتکل انتقال Trojan شما (اگه خالی باشه از `ws` استفاده میکنه)، مثلاً `splithttp`
   - آدرس اشتراک سفارشیت اینجوری میشه:
```url
https://sub.cmliussss.workers.dev/sub?host=hbpb.us.kg&pw=bpb-trojan&path=/tr?ed=2560
```
   - یادت باشه که مسیر حتماً باید "/sub" داشته باشه.

## 3. تنظیمات فایل‌های clash و singbox

   - اگه می‌خوای فایل تنظیمات clash بگیری، `format=clash` رو اضافه کن. مثلاً:
```url
https://sub.cmliussss.workers.dev/auto?format=clash
https://sub.cmliussss.workers.dev/sub?format=clash&host=edgetunnel-2z2.pages.dev&uuid=30e9c5c8-ed28-4cd9-b008-dc67277f8b02&path=/?ed=2048
```
     
   - اگه می‌خوای فایل تنظیمات singbox بگیری، `format=singbox` رو اضافه کن. مثلاً:
```url
https://sub.cmliussss.workers.dev/auto?format=singbox
https://sub.cmliussss.workers.dev/sub?format=singbox&host=edgetunnel-2z2.pages.dev&uuid=30e9c5c8-ed28-4cd9-b008-dc67277f8b02&path=/?ed=2048
```

# متغیرها چی هستن؟

خب، حالا یه لیست از متغیرهایی که می‌تونی استفاده کنی رو برات می‌نویسم:

| متغیر | مثال | توضیح | 
|--------|---------|-----|
| TOKEN | `auto` | مسیر اشتراک سریع واسه گره‌های داخلی /auto (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| HOST | `edgetunnel-2z2.pages.dev` | دامنه مخفی واسه گره‌های داخلی اشتراک سریع (می‌تونی چندتا بذاری، موقع اشتراک یکی رندوم انتخاب میشه) | 
| UUID | `b7a392e2-4ef0-4496-90bc-1c37bb234904` | UUID گره VLESS داخلی واسه اشتراک سریع (با PASSWORD فرق داره، اگه هر دو باشن PASSWORD اولویت داره) | 
| PASSWORD | `bpb-trojan` | رمز عبور گره Trojan داخلی واسه اشتراک سریع (با UUID فرق داره، اگه هر دو باشن PASSWORD اولویت داره) | 
| PATH | `/?ed=2560` | اطلاعات مسیر گره داخلی واسه اشتراک سریع | 
| SNI | `www.10068.cn` | اطلاعات SNI گره داخلی واسه اشتراک سریع (اگه خالی باشه از همون `host` استفاده میکنه) | 
| TYPE | `splithttp` | پروتکل انتقال گره داخلی واسه اشتراک سریع (اگه خالی باشه از `ws` استفاده میکنه) | 
| ADD | `icook.tw:2053#دامنه رسمی بهینه` | مربوط به فیلد `addresses` (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| ADDAPI | [https://raw.github.../addressesapi.txt](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressesapi.txt) | مربوط به فیلد `addressesapi` (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| ADDNOTLS | `icook.hk:8080#دامنه رسمی بهینه` | مربوط به فیلد `addressesnotls` (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| ADDNOTLSAPI | [https://raw.github.../addressesapi.txt](https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/addressesapi.txt) | مربوط به فیلد `addressesnotlsapi` (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| ADDCSV | [https://raw.github.../addressescsv.csv](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/addressescsv.csv) | مربوط به فیلد `addressescsv` (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| DLS | `8` | حداقل سرعت قابل قبول واسه نتایج تست سرعت `addressescsv` | 
| NOTLS | `false` | اگه بذاریش `true`، همیشه گره‌های noTLS رو برمی‌گردونه بدون اینکه دامنه رو چک کنه | 
| TGTOKEN | `6894123456:XXXXXXXXXX0qExVsBPUhHDAbXXXXXqWXgBA` | توکن ربات تلگرام واسه ارسال اعلان‌ها | 
| TGID | `6946912345` | شناسه عددی حساب تلگرام واسه دریافت اعلان‌ها | 
| SUBAPI | `subapi.fxxk.dedyn.io` | بک‌اند تبدیل اشتراک واسه clash، singbox و غیره | 
| SUBCONFIG | [https://raw.github.../ACL4SSR_Online_Full_MultiMode.ini](https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) | فایل پیکربندی تبدیل اشتراک واسه clash، singbox و غیره | 
| SUBNAME | `WorkerVless2sub` | اسم تولیدکننده اشتراک | 
| SOCKS5DATA | [https://raw.github.../socks5Data](https://raw.githubusercontent.com/cmliu/WorkerVless2sub/main/socks5Data) | پول پروکسی Socks5 | 
| PS | `【لطفاً تست سرعت نکنید】` | پیام یادداشت واسه اسم گره | 
| PROXYIP | `proxyip.fxxk.dedyn.io` | ProxyIP پیش‌فرض، اگه چندتا باشه یکی رندوم انتخاب میشه (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| CMPROXYIPS | `proxyip.aliyun.fxxk.dedyn.io#HK` | وقتی HK شناسایی بشه، ProxyIP مربوطه رو اختصاص میده (می‌تونی چندتا بذاری، با `,` یا خط جدید جداشون کن) | 
| CFPORTS | `2053`,`2096`,`8443` | لیست پورت‌های استاندارد حساب CF |

خب، این بود همه چیزی که لازم داری بدونی. امیدوارم کمکت کرده باشه! اگه سوالی داری یا چیزی واست مبهمه، حتماً بپرس. خوشحال میشم کمکت کنم!
