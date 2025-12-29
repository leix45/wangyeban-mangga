
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    // 移除原生菜单栏，使其更像一个纯净的查看器
    autoHideMenuBar: true,
  });

  win.loadFile('index.html');
  
  // 如果需要全屏启动，可以取消下面这一行的注释
  // win.setFullScreen(true);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
