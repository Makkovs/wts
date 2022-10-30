const { channel } = require('diagnostics_channel');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false, 
            preload: path.join(__dirname, 'preload.js')
        }
    })
    
    win.setMenu(null);
    win.loadFile(path.join(__dirname, 'index.html'));
};

app.whenReady().then(() => {
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] }).then(results => {
        let pathDir = results.filePaths[0];
        let jsonFiles = [];
        function searchFile(dir){
            fs.readdirSync(dir).forEach(file =>{
                if(fs.lstatSync(`${dir}\\${file}`).isDirectory()){
                    if(file != "node_modules"){
                        searchFile(`${dir}\\${file}`);
                    }
                }
                if (file == 'package.json'){
                    jsonFiles.push(`${dir}\\${file}`);
                }
            })
        }
        searchFile(pathDir);
        createWindow();
        //win.toggleDevTools()
        console.log(jsonFiles)
        let names = [];
        let versions = [];
        let dependencies = [];
        let devDependencies =[];
        let mainfiles = [];
        let descriptions = [];
        for (let i = 0; i < jsonFiles.length; i++){
            let read = fs.readFileSync(jsonFiles[i]);
            let jsonRead = JSON.parse(read);
            names.push(jsonRead.name);
            versions.push(jsonRead.version);
            mainfiles.push(jsonRead.main)
            if(!(jsonRead.dependencies)){
                dependencies.push('None');
            }else{
                dependencies.push(jsonRead.dependencies)
            }
            if(!(jsonRead.devDependencies)){
                devDependencies.push('None')
            }else{
                devDependencies.push(jsonRead.devDependencies)
            }
            if(!(jsonRead.description)){ 
                descriptions.push('Unspecified'); 
            }else{
                descriptions.push(jsonRead.description);
            }
        }

        ipcMain.handle('names', () => names);
        ipcMain.handle('versions', () => versions);
        ipcMain.handle('dependencies', () => dependencies);
        ipcMain.handle('mainfiles', () => mainfiles);
        ipcMain.handle('devDependencies', () => devDependencies);
        ipcMain.handle('descriptions', () => descriptions);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
