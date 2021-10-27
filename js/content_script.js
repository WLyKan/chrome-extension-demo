const getReboot = () => {
  // todo 把swagger增加一个复制按钮
  const apiContainer = document.querySelectorAll('.opblock-tag-section')
  document.addEventListener('click', (e) => {
    const { target } = e
    console.log('e :>>', e)
  })
  const urlContainer = document.querySelectorAll('.opblock-summary')
  console.log('urlContainer :>>', urlContainer)
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	if(req.cmd == 'reboot') {
    getReboot()
  };
	sendResponse('我收到了你的消息！');
});
