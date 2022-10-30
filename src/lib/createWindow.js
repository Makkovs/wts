const { BrowserWindow } = require('electron');

function createWindow({indexHTMLPath, preloadPath}){
	window = new BrowserWindow({
			width: 1280,
			height: 720,
			webPreferences: {
				contextIsolation: true,
				enableRemoteModule: false, 
				preload: preloadPath
			}
	})
	
	window.setMenu(null);
	console.log(indexHTMLPath);
	window.loadFile(indexHTMLPath);
	return window;
}

module.exports = createWindow;