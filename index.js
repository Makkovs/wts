const createWindow = require('#lib/createWindow.js');



const { app, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');


const indexHTMLPath = path.join(__dirname, 'public/index.html');
const preloadPath = path.join(__dirname, 'preload.js');




app.whenReady().then(async () => {
    const results = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
    let pathDir = results.filePaths[0];
    let jsonFiles = [];

    function searchFile(dir){
        const files = [ dir ];
        const blackList = require("#constants/blackList.js");

        while (files.length){
            
            const file = files.shift();
            const isDirectory = fs.lstatSync(file).isDirectory();

            if (isDirectory){
                const filesList = fs.readdirSync(file)
                    .filter(fileName => fileName in blackList === false)
                    .filter(fileName => fileName.startsWith(".") === false)


                const packageJson = filesList.find(fileName => fileName === "package.json");
                if (packageJson){
                    jsonFiles.push(`${ file }/${ packageJson }`);
                    continue;
                }

                const filesPaths = filesList.map(current => `${ file }/${ current }`);
                files.push(...filesPaths);
            }
            
        }
    }

    
    searchFile(pathDir);
    console.log(jsonFiles);

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

    const win = createWindow({indexHTMLPath, preloadPath});
    win.toggleDevTools();

    ipcMain.handle('names', () => names);
    ipcMain.handle('versions', () => versions);
    ipcMain.handle('dependencies', () => dependencies);
    ipcMain.handle('mainfiles', () => mainfiles);
    ipcMain.handle('devDependencies', () => devDependencies);
    ipcMain.handle('descriptions', () => descriptions);

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
