const createWindow = require('#lib/createWindow.js');



const { app, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');


const indexHTMLPath = path.join(__dirname, 'public/index.html');
const preloadPath = path.join(__dirname, 'preload.js');




app.whenReady().then(async () => {
    const results = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
    let pathDir = results.filePaths[0];

    function findPackagesJson(dir){
        const files = [ dir ];
        const packagesJson = [];
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
                    packagesJson.push(`${ file }/${ packageJson }`);
                    continue;
                }

                const filesPaths = filesList.map(current => `${ file }/${ current }`);
                files.push(...filesPaths);
            }
            
        }

        return packagesJson;
    }

    const ProjectData = require("#classes/ProjectData");
    const projectsData = findPackagesJson(pathDir)
        .map(path => new ProjectData(path));

    projectsData.forEach(project => project.loadSync());


    const win = createWindow({indexHTMLPath, preloadPath});
    win.toggleDevTools();

    ipcMain.handle('projects', () => projectsData);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
