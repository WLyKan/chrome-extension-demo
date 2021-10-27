const reboot = document.getElementById('reboot')

document.addEventListener('click', (e) => {
  const { target } = e

  if (target.id === 'reboot') {
    console.log('reboot');
    sendMessageToContentScript(
      { cmd: 'reboot', value: 'from popup, reboot action' },
      (res) => {
        console.log('res from content :>>', res)
      }
    )
  }
})

function sendMessageToContentScript(message, callback) {
	chrome.tabs.query(
    { active: true, currentWindow: true }, 
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id, 
        message, 
        (res) => {
          if(callback) callback(res);
        }
      )
    }
  );
}
