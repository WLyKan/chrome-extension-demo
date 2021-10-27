let color = '#3aa757';

// 扩展首次安装 或 更新时，触发事件
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});
