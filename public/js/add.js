(async () => {
    const projects = await params.projects();

    for (const project of projects){
        const data = project.data;

        const dependencies = data.dependencies ?
            Object.keys(data.dependencies).join(", ") : "void";

        const devDependencies = data.devDependencies ?
            Object.keys(data.devDependencies).join(", ") : "void";

        const container = document.getElementById('container');
        container.innerHTML +=
        `
            <aside>
                <div class="element"><big>Name:</big> <span>${data.name}</span> 
                <big>Versions:</big> <span>${data.version}</span> <br>
                <big>Main file:</big> <span>${data.main}</span> <br>
                <big>Dependencies:</big><span>${dependencies}</span> <br>
                <big>devDependencies:</big><span>${devDependencies}</span> <br>
                <big>Description:</big> <span>${data.description}</span> </div>
            </aside>
        `

        const node = container.querySelector('aside:last-child');
        node.setAttribute('title', project.path);
    }
})();
