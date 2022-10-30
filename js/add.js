const func = async () => {
    const names = await params.names();
    const versions = await params.versions();
    const dependencies = await params.dependencies();
    const mainfiles = await params.mainfiles();
    const devDependencies = await params.devDependencies();
    const descriptions = await params.descriptions();
    for (let i = 0; i < names.length; i++){
        let dependencies$ = []; let devDependencies$ = []
        if (dependencies[i] != 'None'){
            for (let j in dependencies[i]){
                dependencies$.push(' ' + j);
                console.log(j)
            }
        }else {dependencies$.push('None')}
        if (devDependencies[i] != 'None'){
            for (let j in devDependencies[i]){
                devDependencies$.push(' ' + j);
            }
        }else {devDependencies$.push('None')}
        document.getElementById('container').innerHTML += `<div class="element"><big>Name:</big> <span>${names[i]}</span> 
        <big>Versions:</big> <span>${versions[i]}</span> <br>
        <big>Main file:</big> <span>${mainfiles[i]}</span> <br>
        <big>Dependencies:</big><span>${dependencies$}</span> <br>
        <big>devDependencies:</big><span>${devDependencies$}</span> <br>
        <big>Description:</big> <span>${descriptions[i]}</span> </div>`
    }
}
func()