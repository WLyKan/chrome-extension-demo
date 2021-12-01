let color = '#3aa757';

// 扩展首次安装 或 更新时，触发事件
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener((text) => {
  // Encode user input for special characters , / ? : @ & = + $ #
  var newURL = 'https://kaifa.baidu.com/searchPage?wd=' + encodeURIComponent(text);
  chrome.tabs.create({ url: newURL });
});

chrome.action.setBadgeText({text: 'ON'});
chrome.action.setBadgeBackgroundColor({color: '#4688F1'});

chrome.contextMenus.create({
  id: 'contextMenusSearch',
  title: '搜索：%s', // %s 表示选中的文字
  contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'contextMenusSearch') {
    chrome.tabs.create({url: 'https://kaifa.baidu.com/searchPage?wd=' + encodeURI(info.selectionText)});
  }
})
