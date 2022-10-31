const FileSystem = require("fs");

class ProjectData {
	constructor(path){
		this.path = path;
	}

	loadSync(){
		this.data = this.#readFileSync();
	}

	#readFileSync(){
		const content = FileSystem.readFileSync(this.path, "utf-8");
		return JSON.parse(content);
	}
}

module.exports = ProjectData;