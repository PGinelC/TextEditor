const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

function createWindow(filePath) {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            win.webContents.send('save-triggered');
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            win.webContents.send('save-as-triggered');
          }
        },
        { type: 'separator' },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            win.close();
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'maximize' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);

  win.loadFile('index.html');

  // If a file path is passed, open the file in the editor after the page loads
  if (filePath) {
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('open-file', filePath);
    });
  }

  win.on('closed', () => {
    win = null;
  });
}

// This function attempts to find a valid file path in the arguments
function getFilePathFromArgs() {
  // Check if running in development or production
  const args = process.argv.slice(process.defaultApp ? 2 : 1);
  
  // Find the first argument that looks like a file path
  const filePath = args.find(arg => {
    // Skip known electron/node flags
    if (arg.startsWith('--') || arg === '.' || arg.startsWith('-')) {
      return false;
    }
    // Check if the path exists and is a file
    try {
      return fs.statSync(arg).isFile();
    } catch (err) {
      return false;
    }
  });
  
  return filePath;
}

// Handle file open events from the OS (Windows)
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
    
    // Check if they passed a file path
    const filePath = commandLine.find(arg => {
      try {
        return !arg.startsWith('--') && fs.statSync(arg).isFile();
      } catch (err) {
        return false;
      }
    });
    
    if (filePath) {
      win.webContents.send('open-file', filePath);
    }
  }
});

// Register file open handler for macOS
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  
  if (app.isReady()) {
    if (win) {
      win.webContents.send('open-file', filePath);
    } else {
      createWindow(filePath);
    }
  } else {
    // App not ready yet, store the path to open later
    app.whenReady().then(() => createWindow(filePath));
  }
});

// Make sure this is a single instance app
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    const filePath = getFilePathFromArgs();
    createWindow(filePath);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle save dialog requests from the renderer
ipcMain.on('save-dialog', (event, content) => {
  dialog.showSaveDialog(win, {
    title: 'Save File',
    defaultPath: path.join(app.getPath('documents'), 'document.md'),
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      try {
        fs.writeFileSync(result.filePath, content, 'utf8');
        event.reply('save-dialog-complete', { filePath: result.filePath, success: true });
      } catch (error) {
        console.error('Failed to save file:', error);
        event.reply('save-dialog-complete', { success: false, error: error.message });
      }
    }
  }).catch(err => {
    console.error(err);
    event.reply('save-dialog-complete', { success: false, error: err.message });
  });
});