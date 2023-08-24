/*

    Global State Manager 

*/

class Store {
    state = {
        options: {

        },
        projectDir: "",
        buildDir: "",
    }

    setOptions(options) {
        this.state = {...this.state, options: options}
    }

    getOptions() {
        return this.state.options;
    }

    setProjectDir(dir) {
        this.state = {...this.state, projectDir: dir}
    }

    getProjectDir() {
        return this.state.projectDir;
    }

    setBuildDir(dir) {
        this.state = {...this.state, buildDir: dir}
    }

    getBuildDir() {
        return this.state.buildDir;
    }
}

export default new Store();