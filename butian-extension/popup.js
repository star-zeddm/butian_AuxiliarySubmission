let extEnabled = true;   // 默认开

/* 监听 popup 开关 */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.cmd === 'toggle') {
    extEnabled = msg.enabled;
    if (!extEnabled) document.getElementById('beibu_ui')?.remove();
  }
});

/* 启动时读一次状态 */
chrome.storage.sync.get({ enabled: true }, val => {
  extEnabled = val.enabled;
  if (extEnabled) start();   // 把原来的 ceshi(); create_btn(); 包进 start()
});

function start() {
  ceshi();
  create_btn();
}


document.getElementById('openPanel').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: 'showPanel' });
    });
  });