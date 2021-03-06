// Initialize button with user's preferred color
const changeColor = document.getElementById("changeColor");
const switchBtn = document.getElementById("switch");

const EXT_Id = 'cblpkaojhopjmbfmlhjpbchkilkbkpmf'

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });

  chrome.runtime.sendMessage(EXT_Id, { color: changeColor.style.backgroundColor }, (res) => {
    console.log('popup: message sent:', res);
  });
});

switchBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const status = await chrome.action.getBadgeText({ tabId: tab.id })

  chrome.action.setBadgeText({text: `${status === 'ON' ? 'OFF' : 'ON'}`});
  chrome.action.setTitle({ title: '测试title' })
  chrome.action.setBadgeBackgroundColor({color: `${status === 'ON' ? '#e1e1e1' : '#4688F1'}`});
})

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
