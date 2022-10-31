(async () => {
    const projects = await params.projects();

    for (const project of projects){
        const data = project.data;

        
        document.getElementById('container').innerHTML +=
        `
            <div class="element"><big>Name:</big> <span>${data.name}</span> 
            <big>Versions:</big> <span>${data.version}</span> <br>
            <big>Main file:</big> <span>${data.main}</span> <br>
            <big>Dependencies:</big><span>${data.dependencies ?? "void"}</span> <br>
            <big>devDependencies:</big><span>${data.devDependencies ?? "void"}</span> <br>
            <big>Description:</big> <span>${data.description}</span> </div>
        `
    }
})();
