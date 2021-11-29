# Chrome 插件开发

浏览器五大进程：

1. 主进程
2. 渲染进程，多个
3. 网络进程
4. GPU进程
5. 插件进程，多个

Chrome 插件是基于 web 技术（如html，css 和 JavaScript）构建的软件，是用户能够定制 Chrome 浏览体验。

插件运行在独立的沙盒环境，可以与 Chrome 浏览器交互。

学习资源：

- [chrome 官方文档](https://developer.chrome.com/docs/extensions/)
- [官方示例](https://github.com/GoogleChrome/chrome-extensions-samples)
  - [~~mdn 实例~~](https://github.com/mdn/webextensions-examples)
- [探索API功能](https://developer.chrome.com/docs/extensions/mv3/devguide/)
- [API参考](https://developer.chrome.com/docs/extensions/reference/)

在开发环境，可以通过插件开发者模式，加载未打包的插件代码。测试完成后，可以通过打包发布路程，发布到 Chrome 应用商店。

## 关于插件的策略说明

为了保证浏览器插件度用户体验的质量，有以下约定策略：

- 扩展插件必须实现一个单一且易于理解的目的。一个扩展可以包含多个组件和一系列功能，只要一切都有助于实现一个共同的目的。
- 用户界面应该是最小的且有目的性的。

## 基本组成

Chrome插件没有严格的项目结构要求，只要保证本目录有一个manifest.json即可。最新的 Manifest 版本是 V3，自Chrome 88版本开始使用。

开发中，代码有任何改动都必须重新加载插件。

- manifest.json 配置清单，必须
  - manifest_version、name、version3个是必不可少的，description和icons是推荐的。
- background script 后台脚本: background.js
- content script 内容脚本，注入到网页内的代码
  - 可以访问DOM，但是脚本执行环境是隔离的，不能和页面上的js交互，
  - 可以使用`chrome.scripting.executeScript()`(需要`activeTab`权限) 或 在manifest中定义的方式来注入内容脚本
  - 在 manifest 中设置 `web_accessible_resources`, 可以动态向网页中插入js代码
- options page 配置页: options.html
- UI元素: popup.html 弹窗
- 其他逻辑代码

## Hello World

目录组成：

- manifest.json，配置清单，必须
- popup 可选
- icon 可选

```json
{
  "name": "Hello Extensions",
  "description": "Base Level Extension",
  "version": "1.0",
  "manifest_version": 3,
  "action": { // 在配置中注册
    "default_popup": "hello.html", // 弹出页面
    "default_icon": "hello_extensions.png" // icon
  },
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+F",
        "mac": "MacCtrl+Shift+F"
      },
      "description": "Opens hello.html"
    }
  }
}
```

## 后台脚本 background scripts

```json
{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": { // 注册后台脚本
    "service_worker": "background.js"
  },
  "permissions": ["storage"] // 注册权限
}
```

background script 的作用是告诉插件要引用哪个文件，以及该文件的行为。后台页提供了一个独立于任何其他窗口或选项卡的环境，这使得插件能够侦听事件并做出反应。

> 在 MV3 中，后台页面配置移到了 service worker 中。[详情](https://developers.google.com/web/fundamentals/primers/service-workers/)

上述例子中，Chrome 知道了插件包含一个 service worker，当重新加载扩展插件时，Chrome 会扫描指定文件，以获取其他指令，例如需要侦听的重要事件。

service worker 注意事项：

- 在不使用时终止，在需要时重新启动，类似于事件页面。启动，执行工作，终止，这个操作会在整个浏览器会话中循环发生。因此，在service worker中，使用：
  - `chrome.storage.local.set({ name });`来持久化状态
  - `chrome.alarms.create({ delayInMinutes: 3 });`创建定时器
  - 不支持`XMLHttpRequest`，使用` fetch() `
- service worker 没有访问 DOM 的权限。

## 用户界面 popup

![IMAGE](https://wd.imgix.net/image/BrQidfK9jaQyIHwdw91aVpkPiib2/8oLwFaq0VFIQtw4mcA91.png?auto=format&w=338)


```json
{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"],
  "action": { // 注册操作
    "default_popup": "popup.html",
    "default_icon": { // 工具栏图标, 可选
      "16": "/images/icon16.png",
      "48": "/images/icon48.png",
      "128": "/images/icon128.png"
    }
  },
  "icons": { // 管理页面，权限警告页面图标
    "16": "/images/icon16.png",
    "48": "/images/icon48.png",
    "128": "/images/icon128.png"
  }
}
```

要使用`chrome.action` api，必须在 manifest 中先注册。action 控制浏览器插件工具栏的动作图标。

> 即使没有制定操作，每个扩展都会在工具栏中有一个图标。

弹出窗口不能大与 `800x600`，可以包含样式表和js文件链接，不能包含js代码。

## Manifest V3

MV3 是扩展插件推出十年来最大的变化之一，增强了安全性，隐私性和性能，引入了现代化的web技术，如 service worker 和 promise。

## 演示

演示步骤列表：git tag list
使用：`git checkout <tagName>`

- step01 hello world
- step02 快捷键
- step03 注册background scripts，
  - 在开发页面控制台点击查看
- step04 用户界面 popup.html
- step05 修改页面颜色 popup.js
- step06 插件配置页面 options.html,
  - 工具栏右键，选项 
- step07 配置也没dialog
- step08 omnibox search
- 


![IMAGE](https://wd.imgix.net/image/BrQidfK9jaQyIHwdw91aVpkPiib2/CNDAVsTnJeSskIXVnSQV.png?auto=format&w=439)

## API 方法

除非特别说明，`chrome.*`的API方法都是异步的，会立即返回，无需等待操作完成。

## chrome.storage

permissions: `storage`

类似 localStorage API，但有一些不同：

- 数据可以自动同步，在已经登陆的多个浏览器间同步 `storage.sync`
- 扩展脚本可以直接访问数据，而无需后台页面
- 拆封匿名行为时，也可以保留用户扩展设置
- 大容量读写操作是异步的，所以更快
- 数据可以存储为对象，localStorage 只能以字符串形式存储
- 可以读取管理员为扩展配置的企业策略 `storage.managed`

```js
chrome.storage.sync.set({key: value}, function() {
  console.log('Value is set to ' + value);
});

chrome.storage.sync.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
});

```

